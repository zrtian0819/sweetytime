// server/routes/user.js
import express from 'express'
import db from '#configs/mysql.js'
import bcrypt from 'bcrypt'
const router = express.Router()

// 獲取所有使用者
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// 登入驗證
router.post('/login', async (req, res) => {
  const { account, password } = req.body

  try {
    // 1. 先用 account 查詢使用者
    const [users] = await db.query(
      'SELECT * FROM `users` WHERE `account` = ? AND activation = "1"',
      [account]
    )
    
    // 2. 檢查使用者是否存在
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '帳號或密碼錯誤' 
      })
    }

    const user = users[0]

    // 3. 驗證密碼
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (passwordMatch) {
      // 登入成功
      res.json({ 
        success: true, 
        message: '登入成功',
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          account: user.account,
          email: user.email,
          // 不回傳密碼相關資訊
        }
      })
    } else {
      // 密碼錯誤
      res.status(401).json({ 
        success: false, 
        message: '帳號或密碼錯誤' 
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: '登入發生錯誤' 
    })
  }
})

export default router