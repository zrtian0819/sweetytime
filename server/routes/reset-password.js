import express from 'express'
import transporter from '../configs/mail.js'
import db from '#configs/mysql.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// 生成6位數OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

// 請求OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body
    
    // 檢查用戶是否存在
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此信箱對應的帳號'
      })
    }

    // 生成OTP
    const otp = generateOTP()
    const expTimestamp = Date.now() + 10 * 60 * 1000  // 10分鐘後過期

    // 儲存OTP到資料庫
    await db.execute(
      'INSERT INTO otp (user_id, email, token, exp_timestamp) VALUES (?, ?, ?, ?)',
      [users[0].id, email, otp, expTimestamp]
    )

    // 發送OTP信件
    const mailOptions = {
      from: `"甜覓食光"<${process.env.SMTP_TO_EMAIL}>`,
      to: email,
      subject: '密碼重設驗證碼',
      text: `親愛的用戶
      我們收到了您的密碼重設請求。
  
      您的驗證碼為：${otp}
      此驗證碼將在10分鐘後失效。
      
      如果這不是您發起的請求，請忽略此信件。
  
      甜覓食光開發團隊`
    }

    await transporter.sendMail(mailOptions)

    res.json({
      status: 'success',
      message: '驗證碼已發送到您的信箱'
    })

  } catch (err) {
    console.error('OTP request error:', err)
    res.status(500).json({
      status: 'error',
      message: '驗證碼發送失敗'
    })
  }
})

// 會員中心重設密碼
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    // 檢查OTP是否有效
    const [otpRecords] = await db.execute(
      `SELECT * FROM otp 
       WHERE email = ? 
       AND token = ? 
       AND exp_timestamp > ?
       ORDER BY createdAt DESC 
       LIMIT 1`,
      [email, otp, Date.now()]
    )

    if (otpRecords.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '驗證碼無效或已過期'
      })
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    )

    // 刪除已使用的OTP
    await db.execute(
      'DELETE FROM otp WHERE id = ?',
      [otpRecords[0].id]
    )

    res.json({
      status: 'success',
      message: '密碼已成功重設'
    })

  } catch (err) {
    console.error('Password reset error:', err)
    res.status(500).json({
      status: 'error',
      message: '密碼重設失敗'
    })
  }
})

// 驗證OTP並重設密碼
// 個人資料頁面的密碼重設
router.post('/reset-password-profile', async (req, res) => {
  try {
    const { email, newPassword } = req.body

    // 檢查用戶是否存在
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此信箱對應的帳號'
      })
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    )

    res.json({
      status: 'success',
      message: '密碼已成功重設'
    })

  } catch (err) {
    console.error('Password reset error:', err)
    res.status(500).json({
      status: 'error',
      message: '密碼重設失敗'
    })
  }
})

export default router