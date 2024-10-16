import express from 'express'
const router = express.Router()

import * as crypto from 'crypto'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'
// 資料庫使用
import sequelize from '#configs/db.js'
const { Purchase_Order } = sequelize.models

// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

//綠界全方位金流技術文件：
// https://developers.ecpay.com.tw/?p=2856
// 信用卡測試卡號：4311-9522-2222-2222 安全碼 222

//一、選擇帳號，是否為測試環境
// const MerchantID = '3002607' //必填
// const HashKey = 'pwFHCqoQZGmho4w6' //3002607
// const HashIV = 'EkRm7iFT261dpevs' //3002607
// let isStage = true // 測試環境： true；正式環境：false
const MerchantID = process.env.ECPAY_MERCHANT_ID //必填
const HashKey = process.env.ECPAY_HASH_KEY //3002607
const HashIV = process.env.ECPAY_HASH_IV //3002607
let isStage = process.env.ECPAY_TEST // 測試環境： true；正式環境：false
const ReturnURL = process.env.ECPAY_RETURN_URL
const OrderResultURL = process.env.ECPAY_ORDER_RESULT_URL
const ReactClientBackURL = process.env.ECPAY_ORDER_CALLBACK_URL

// 前端發送訂單id給後端，後端再發送要送到綠界的表單
// http://localhost:3005/ecpay?orderId=123123
router.get('/payment', authenticate, async (req, res, next) => {
  // 從資料庫得到order資料
  const orderId = req.query.orderId
  // 從資料庫取得訂單資料
  const orderRecord = await Purchase_Order.findByPk(orderId, {
    raw: true, // 只需要資料表中資料
  })

  console.log('獲得訂單資料，內容如下：')
  console.log(orderRecord)

  //二、輸入參數
  const TotalAmount = orderRecord.amount
  const TradeDesc = '商店線上付款'
  const ItemName = '訂單編號' + orderRecord.id + '商品一批'

  const ChoosePayment = 'ALL'

  // 以下參數不用改
  const stage = isStage ? '-stage' : ''
  const algorithm = 'sha256'
  const digest = 'hex'
  const APIURL = `https://payment${stage}.ecpay.com.tw/Cashier/AioCheckOut/V5`
  // 交易編號
  // const MerchantTradeNo =
  //   new Date().toISOString().split('T')[0].replaceAll('-', '') +
  //   crypto.randomBytes(32).toString('base64').substring(0, 12)

  const MerchantTradeNo = `od${new Date().getFullYear()}${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}${new Date()
    .getDate()
    .toString()
    .padStart(2, '0')}${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}${new Date()
    .getMinutes()
    .toString()
    .padStart(2, '0')}${new Date()
    .getSeconds()
    .toString()
    .padStart(2, '0')}${new Date().getMilliseconds().toString().padStart(2)}`

  // 交易日期時間
  const MerchantTradeDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  //三、計算 CheckMacValue 之前
  let ParamsBeforeCMV = {
    MerchantID: MerchantID,
    MerchantTradeNo: MerchantTradeNo,
    MerchantTradeDate: MerchantTradeDate.toString(),
    PaymentType: 'aio',
    EncryptType: 1,
    TotalAmount: TotalAmount,
    TradeDesc: TradeDesc,
    ItemName: ItemName,
    ChoosePayment: ChoosePayment,
    ReturnURL,
    OrderResultURL,
  }

  //四、計算 CheckMacValue
  function CheckMacValueGen(parameters, algorithm, digest) {
    // const crypto = require('crypto')
    let Step0

    Step0 = Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    function DotNETURLEncode(string) {
      const list = {
        '%2D': '-',
        '%5F': '_',
        '%2E': '.',
        '%21': '!',
        '%2A': '*',
        '%28': '(',
        '%29': ')',
        '%20': '+',
      }

      Object.entries(list).forEach(([encoded, decoded]) => {
        const regex = new RegExp(encoded, 'g')
        string = string.replace(regex, decoded)
      })

      return string
    }

    const Step1 = Step0.split('&')
      .sort((a, b) => {
        const keyA = a.split('=')[0]
        const keyB = b.split('=')[0]
        return keyA.localeCompare(keyB)
      })
      .join('&')
    const Step2 = `HashKey=${HashKey}&${Step1}&HashIV=${HashIV}`
    const Step3 = DotNETURLEncode(encodeURIComponent(Step2))
    const Step4 = Step3.toLowerCase()
    const Step5 = crypto.createHash(algorithm).update(Step4).digest(digest)
    const Step6 = Step5.toUpperCase()
    return Step6
  }
  const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest)

  //五、將所有的參數製作成 payload
  const AllParams = { ...ParamsBeforeCMV, CheckMacValue }
  console.log('AllParams:', AllParams)

  const inputs = Object.entries(AllParams)
    .map(function (param) {
      return `<input name=${param[0]} value="${param[1].toString()}" style="display:none"><br/>`
    })
    .join('')

  //六、製作送出畫面
  //   const htmlContent = `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //     <title>全方位金流-測試</title>
  // </head>
  // <body>
  //     <form method="post" action="${APIURL}">
  // ${inputs}
  // <input type ="submit" value = "送出參數">
  //     </form>
  // </body>
  // </html>
  //`
  //res.json({ htmlContent })
  // res.send(htmlContent)

  const htmlContent = `<!DOCTYPE html>
  <html>
  <head>
      <title>全方位金流測試</title>
  </head>
  <body>
      <form method="post" action="${APIURL}" style="display:none">
  ${inputs}
  <input type="submit" value="送出參數" style="display:none">
        </form>
  <script>
    document.forms[0].submit();
  </script>
  </body>
  </html>`

  res.send(htmlContent)
})

router.post('/result', async (req, res, next) => {
  console.log('綠界回傳的資料如下：')
  console.log(req.body)
  // res.send('綠界回傳的資料如下：' + JSON.stringify(req.body))
  // 寫入資料表 RtnCode === '1' 代表交易成功
  res.redirect(
    ReactClientBackURL + '?' + new URLSearchParams(req.body).toString()
  )
})

export default router
