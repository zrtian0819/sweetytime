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
        message: '帳號或密碼錯誤',
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
          phone: user.phone,
          birthday: user.birthday,
          sign_up_time: user.sign_up_time,
          // 不回傳密碼相關資訊
        },
      })
    } else {
      // 密碼錯誤
      res.status(401).json({
        success: false,
        message: '帳號或密碼錯誤',
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: '登入發生錯誤',
    })
  }
})

// 獲取所有使用者
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// 註冊新使用者
router.post('/register', async (req, res) => {
  const { name, account, email, password, phone, birthday } = req.body

  try {
    // 1. 驗證必要欄位
    if (!name || !account || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '所有必填欄位都需要填寫',
      })
    }

    // 2. 檢查帳號是否已存在
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE account = ? OR email = ?',
      [account, email]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: '帳號或信箱已經被使用',
      })
    }

    // 3. 密碼雜湊
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 4. 取得目前時間作為註冊時間
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 5. 新增使用者到資料庫
    const [result] = await db.query(
      'INSERT INTO users (name, account, email, password, phone, birthday, role, activation, sign_up_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name, 
        account, 
        email, 
        hashedPassword, 
        phone || null, 
        birthday || null, 
        'user', 
        '1',
        now // 加入註冊時間
      ]
    )

    // 6. 回傳成功訊息
    res.status(201).json({
      success: true,
      message: '註冊成功',
      user: {
        id: result.insertId,
        name,
        account,
        email,
        phone,
        birthday,
        role: 'user',
        sign_up_time: now // 一併回傳註冊時間
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: '註冊時發生錯誤',
    })
  }
})


export default router
