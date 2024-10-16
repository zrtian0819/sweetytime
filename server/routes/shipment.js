import express from 'express'
const router = express.Router()

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

const callback_url = process.env.SHIP_711_STORE_CALLBACK_URL

// 註: 本路由與資料庫無關，單純轉向使用

// POST
router.post('/711', function (req, res, next) {
  //console.log(req.body)
  res.redirect(callback_url + '?' + new URLSearchParams(req.body).toString())
})

// 測試路由用
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'shipment route is OK' })
// })

export default router
