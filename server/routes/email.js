import express from 'express'
import transporter from '#configs/mail.js'
import 'dotenv/config.js'

const router = express.Router()

// email內容模板 - 原有的歡迎信
const createWelcomeMailOptions = (toEmail) => {
  const name = toEmail.split('@')[0]
  return {
    from: `"甜覓食光"<${process.env.SMTP_TO_EMAIL}>`,
    to: toEmail,
    subject: '歡迎加入甜覓食光管理團隊',
    text: `親愛的 ${name || '管理員'}
    感謝您對甜覓食光的支持！我們很高興通知您已經成功加入我們的管理團隊。

    以下是一些重要資訊：
    1. 請在24小時內完成帳號啟用
    2. 閱讀管理員守則與規範
    3. 加入管理員通訊群組

    甜覓食光開發團隊`
  }
}

// 忘記密碼郵件模板
const createResetPasswordMailOptions = (toEmail, otp) => {
  const name = toEmail.split('@')[0]
  return {
    from: `"甜覓食光"<${process.env.SMTP_TO_EMAIL}>`,
    to: toEmail,
    subject: '密碼重設驗證碼',
    text: `親愛的 ${name || '使用者'}
    我們收到了您的密碼重設請求。

    您的驗證碼為：${otp}
    此驗證碼將在10分鐘後失效。
    
    如果這不是您發起的請求，請忽略此信件。

    甜覓食光開發團隊`
  }
}

export { createWelcomeMailOptions, createResetPasswordMailOptions }

/* 寄送email給多位收件者 */
router.post('/send', async (req, res) => {
  try {
    // 從請求體獲取收件者信箱陣列
    const { emails } = req.body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: '請提供有效的收件者信箱陣列' 
      })
    }

    // 記錄發送結果
    const results = []
    
    // 逐一發送郵件
    for (const email of emails) {
      try {
        const mailOptions = createMailOptions(email)
        const info = await transporter.sendMail(mailOptions)
        results.push({
          email,
          status: 'success',
          messageId: info.messageId
        })
      } catch (err) {
        results.push({
          email,
          status: 'error',
          message: err.message
        })
      }
    }

    // 回傳所有發送結果
    return res.json({ 
      status: 'success', 
      data: {
        results,
        summary: {
          total: results.length,
          success: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'error').length
        }
      }
    })

  } catch (err) {
    console.error('Email sending error:', err)
    return res.status(500).json({ 
      status: 'error', 
      message: '郵件發送處理失敗' 
    })
  }
})

export default router