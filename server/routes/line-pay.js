import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Purchase_Order } = sequelize.models

// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// line pay使用npm套件
import { createLinePayClient } from 'line-pay-merchant'
// 產生uuid用
import { v4 as uuidv4 } from 'uuid'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})

// 在資料庫建立order資料(需要會員登入才能使用)
router.post('/create-order', authenticate, async (req, res) => {
  // 會員id由authenticate中介軟體提供
  const userId = req.user.id

  //產生 orderId與packageId
  const orderId = uuidv4()
  const packageId = uuidv4()

  // 要傳送給line pay的訂單資訊
  const order = {
    orderId: orderId,
    currency: 'TWD',
    amount: req.body.amount,
    packages: [
      {
        id: packageId,
        amount: req.body.amount,
        products: req.body.products,
      },
    ],
    options: { display: { locale: 'zh_TW' } },
  }

  // 要儲存到資料庫的order資料
  const user_id = userId
  const lesson_id = req.body.products[0].id
  const sign_up = req.body.products[0].time ? req.body.products[0].time : null
  const order_info = JSON.stringify(order)
  console.log(user_id)
  console.log(lesson_id)
  console.log(sign_up)
  console.log(orderId)

  // 儲存到資料庫
  const [rows] = await db.query(
    `INSERT INTO student (id,order_id, user_id, lesson_id, sign_up_time, canceled_time, order_info,	reservation,transaction_id) VALUES (NULL,?, ?, ?, ?, NULL, ?,NULL,NULL);`,
    [orderId, user_id, lesson_id, sign_up, order_info]
  )

  // 回傳給前端的資料
  res.json({ status: 'success', dataOrder: { order } })
})

// 重新導向到line-pay，進行交易(純導向不回應前端)
// 資料格式參考 https://enylin.github.io/line-pay-merchant/api-reference/request.html#example
router.get('/reserve', async (req, res) => {
  if (!req.query.orderId) {
    return res.json({ status: 'error', message: 'order id不存在' })
  }

  const orderId = req.query.orderId
  // 設定重新導向與失敗導向的網址
  const redirectUrls = {
    confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
    cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  }

  // 從資料庫取得訂單資料
  const orderRecord = await db.query(`SELECT * FROM student WHERE order_id=?`, [
    orderId,
  ])
  console.log(orderRecord)

  // const orderRecord = await Purchase_Order.findByPk(orderId, {
  //   raw: true, // 只需要資料表中資料
  // })

  // const orderRecord = await findOne('orders', { order_id: orderId })

  // order_info記錄要向line pay要求的訂單json
  const order = orderRecord[0][0].order_info

  const orderInfo = JSON.parse(order)

  //const order = cache.get(orderId)
  console.log(`獲得訂單資料，內容如下：`)
  console.log(orderInfo)

  try {
    // 向line pay傳送的訂單資料
    const linePayResponse = await linePayClient.request.send({
      body: { ...orderInfo, redirectUrls },
    })
    console.log(linePayResponse.body)

    // 深拷貝一份order資料
    const reservation = JSON.parse(JSON.stringify(orderInfo))

    reservation.returnCode = linePayResponse.body.returnCode
    reservation.returnMessage = linePayResponse.body.returnMessage
    reservation.transactionId = linePayResponse.body.info.transactionId
    reservation.paymentAccessToken =
      linePayResponse.body.info.paymentAccessToken

    console.log(`預計付款資料(Reservation)已建立。資料如下:`)
    console.log(reservation)

    const strReservation = JSON.stringify(reservation)
    console.log('存進資料庫前', strReservation)
    const dataTransactionId = reservation.transactionId
    console.log(dataTransactionId)
    // // 在db儲存reservation資料
    const [result] = await db.query(
      `UPDATE student SET reservation = ?, transaction_id = ? WHERE order_id = ?; `,
      [strReservation, dataTransactionId, orderId]
    )

    // console.log(result)

    // 導向到付款頁面， line pay回應後會帶有info.paymentUrl.web為付款網址
    res.redirect(linePayResponse.body.info.paymentUrl.web)
  } catch (e) {
    console.log('error', e)
  }
})

// 向Line Pay確認交易結果
// 格式參考: https://enylin.github.io/line-pay-merchant/api-reference/confirm.html#example
router.get('/confirm', async (req, res) => {
  // 網址上需要有transactionId
  const transactionId = req.query.transactionId

  // 從資料庫取得交易資料
  const dbOrder = await db.query(
    `SELECT * FROM student WHERE transaction_id=?`,
    [transactionId]
  )
  // const dbOrder = await Purchase_Order.findOne({
  //   where: { transaction_id: transactionId },
  //   raw: true, // 只需要資料表中資料
  // })

  console.log(dbOrder[0][0])

  // 交易資料
  const transaction = JSON.parse(dbOrder[0][0].reservation)

  console.log(transaction)

  // 交易金額
  const amount = transaction.amount
  console.log(amount)

  try {
    // 最後確認交易
    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: {
        currency: 'TWD',
        amount: amount,
      },
    })

    // linePayResponse.body回傳的資料
    console.log(linePayResponse)

    // transaction.confirmBody = linePayResponse.body

    // // status: 'pending' | 'paid' | 'cancel' | 'fail' | 'error'
    // let status = 'paid'

    // if (linePayResponse.body.returnCode !== '0000') {
    //   status = 'fail'
    // }

    // 更新資料庫的訂單狀態
    // const result = await Purchase_Order.update(
    //   {
    //     status,
    //     return_code: linePayResponse.body.returnCode,
    //     confirm: JSON.stringify(linePayResponse.body),
    //   },
    //   {
    //     where: {
    //       id: dbOrder.id,
    //     },
    //   }
    // )

    // console.log(result)

    return res.json({ status: 'success', data: linePayResponse.body })
  } catch (error) {
    return res.json({ status: 'fail', data: error.data })
  }
})

// 檢查交易用
router.get('/check-transaction', async (req, res) => {
  const transactionId = req.query.transactionId

  try {
    const linePayResponse = await linePayClient.checkPaymentStatus.send({
      transactionId: transactionId,
      params: {},
    })

    // 範例:
    // {
    //   "body": {
    //     "returnCode": "0000",
    //     "returnMessage": "reserved transaction."
    //   },
    //   "comments": {}
    // }

    res.json(linePayResponse.body)
  } catch (e) {
    res.json({ error: e })
  }
})

export default router
