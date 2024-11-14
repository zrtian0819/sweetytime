import express from 'express'
import db from '#configs/mysql.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

//取得所有產品的陣列
router.get('/product', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得product_id的單筆產品資訊
router.get('/product/:id', async (req, res) => {
  const pid = req.params.id
  try {
    const [row] = await db.query(`SELECT * FROM product WHERE id=${pid}`)
    res.json(row)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得product_id的所有照片
router.get('/product_photo/:id', async (req, res) => {
  const pid = req.params.id
  try {
    const [rows] = await db.query(
      `SELECT * FROM product_photo WHERE product_id = ${pid}`
    )
    res.json(rows[0]) //回傳第一張照片
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得shop_id的商家單筆資料
router.get('/shop/:id', async (req, res) => {
  const sid = req.params.id
  try {
    const [rows] = await db.query(`SELECT * FROM shop WHERE id = ${sid}`)
    res.json(rows[0]) //回傳第一筆資料
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得user_id的所有常用地址
router.get('/address/:id', async (req, res) => {
  const uid = req.params.id
  try {
    const [rows] = await db.query(
      `SELECT * FROM address WHERE user_id = ${uid}`
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 取得所有平台提供的寄件方式
router.get('/delivery', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM delivery`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得user_id中的所有優惠券
router.get('/user-coupon/:id', async (req, res) => {
  const uid = req.params.id
  try {
    const [rows] = await db.query(
      `SELECT 
        c.id AS coupon_id,
        c.name,
        c.discount_rate,
        c.type,
        c.minimumSpend,
        c.maximumDiscount,
        c.start_date,
        c.end_date,
        c.status,
        c.termsAndConditions,
        c.activation,
        uc.id AS user_coupon_id,
        uc.user_id,
        uc.recieved_time,
        uc.used_time,
        uc.user_collected
      FROM coupon c
      JOIN users_coupon uc ON uc.coupon_id = c.id
      WHERE uc.user_id = ?;`,
      [uid]
    )
    res.json(rows) //回傳第一筆資料
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//將訂單推送到資料庫
router.post('/create-order', async (req, res) => {
  let orderIds = []

  try {
    // 只取得需要的數據
    const orderData = req.body
    console.log('收到的訂單數據:', orderData)
    const currentTime = getCurrentTime()

    // 要傳送給line pay的訂單資訊
    const orders = {
      orderId: [],
      currency: 'TWD',
      amount: 0,
      productName: '甜覓食光商品',
      // productImgUrl:""
      // packages: [],
      options: { display: { locale: 'zh_TW' } },
    }

    // {
    //   id: packageId,
    //   amount: req.body.amount,
    //   products: req.body.products,
    // },

    // 處理訂單邏輯
    orderData.forEach(async (shop) => {
      let {
        user_id,
        shop_id,
        coupon_id,
        payment,
        way,
        address,
        name,
        phone,
        note,
        shopTotal,
        afterDiscount,
        cart_content,
        ship_pay,
      } = shop

      if (!afterDiscount || afterDiscount == '') {
        //沒有被折扣的情況
        afterDiscount = shopTotal
      }

      const orderId = uuidv4()

      //整理linepay order物件
      orders.orderId.push(orderId) //將當前的訂單編號推入
      orderIds.push(orderId)
      orders.amount += afterDiscount + ship_pay

      //建立訂單
      const [result] = await db.query(
        `INSERT INTO orders (id,status,user_id,shop_id,coupon_id,payment,delivery,delivery_address,delivery_name,delivery_phone,note,order_time,total_price,ship_pay) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          orderId,
          '進行中',
          user_id,
          shop_id,
          coupon_id,
          payment,
          way,
          address,
          name,
          phone,
          note,
          currentTime,
          afterDiscount,
          ship_pay,
        ]
      )

      console.log('訂單創建的數量:', result.affectedRows)

      //優惠券被使用的紀錄填入資料庫
      if (coupon_id) {
        const [coupon_used] = await db.query(
          `UPDATE users_coupon 
            SET used_time = ? 
            WHERE user_id = ? AND coupon_id = ?
          `,
          [currentTime, user_id, coupon_id]
        )
      }

      // let order_id = result.insertId
      cart_content.forEach(async (product) => {
        const { id, quantity, price, discount } = product
        const thatTimePrice = price * Number(discount) * quantity //這邊的thatTimePrice = 產品單價*產品折價*數量 (並非折扣後的單價)
        const product_id = id

        // 產生訂單
        const [orderItem_result] = await db.query(
          `INSERT INTO orders_items (order_id,product_id,amount,that_time_price) VALUES (?,?,?,?)`,
          [orderId, product_id, quantity, thatTimePrice]
        )

        // 商品庫存扣除
        const [pd_result] = await db.query(
          'UPDATE product SET stocks = stocks - ? WHERE id = ? AND stocks >= ?',
          [quantity, product_id, quantity]
        )

        // const packageId = uuidv4()
        // const linePayPd = {
        //   id: packageId,
        //   amount: afterDiscount + ship_pay,
        //   products: req.body.products,
        // }
        // orders.packages.push(linePayPd)
      })
    })

    orders.orderId = orders.orderId.join(',')

    //把order_info存入當前的資料
    orderIds.forEach(async (orderId) => {
      const [rows] = await db.query(
        `UPDATE orders SET order_info=? WHERE id=?`,
        [JSON.stringify(orders), orderId]
      )
    })

    // 返回處理結果
    res.status(201).json({
      success: true,
      message: '訂單創建成功',
      data: { orders, orderIds }, // 返回訂單數據和訂單號碼
    })
  } catch (error) {
    console.error('訂單創建錯誤:', error)
    res.status(500).json({
      success: false,
      message: '訂單創建失敗',
      error: error.message,
    })
  }
})

router.post('/create-order-lesson', async (req, res) => {
  console.log(req.body)
  const user_id = req.body.user_id
  const lesson_id = req.body.lesson_id
  const sign_up = req.body.sign_up
  try {
    const [rows] = await db.query(
      `INSERT INTO student (id,order_id, user_id, lesson_id, sign_up_time, canceled_time, order_info,	reservation,transaction_id) VALUES (NULL,NULL, ?, ?, ?, NULL, NULL,NULL,NULL);`,
      [user_id, lesson_id, sign_up]
    )
    res.status(201).json({ success: true, message: '報名成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '課程報名寫入資料庫失敗' })
  }
})

export default router

// 取得當前時間的函式
function getCurrentTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // 月份從0開始，需+1
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

//console.log(getCurrentTime()) // 輸出: 2024-08-01 08:34:00
