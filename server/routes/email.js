import express from 'express'
import transporter from '#configs/mail.js'
import 'dotenv/config.js'

const router = express.Router()

// email內容
const mailOptions = {
  from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
  to: 'hello@test.com',
  subject: '這是一封測試電子郵件',
  text: `你好， \r\n通知你有關第一封郵件的事。\r\n\r\n敬上\r\n開發團隊`,
}

/* 寄送email的路由 */
router.get('/send', function (req, res, next) {
  // 寄送
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      return res.status(400).json({ status: 'error', message: err })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

export default router
