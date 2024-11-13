import express from 'express'
import db from '#configs/mysql.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()
// 驗證管理員權限的中間件
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user?.role === 'admin') {
      next()
    } else {
      res.status(403).json({
        success: false,
        message: '需要管理員權限',
      })
    }
  })
}

// 驗證 token 的 middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded // 將解碼後的用戶信息添加到 request 對象
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }
}

// 獲取所有使用者
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/regular-users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = "user"')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching regular users:', error)
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
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          account: user.account,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      )
      res.json({
        success: true,
        message: '登入成功',
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          account: user.account,
          email: user.email,
          phone: user.phone,
          birthday: user.birthday,
          sign_up_time: user.sign_up_time,
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
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

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
        now, // 加入註冊時間
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
        sign_up_time: now, // 一併回傳註冊時間
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

// 驗證 token
router.get('/verify', async (req, res) => {
  try {
    // 從 headers 中獲取 token
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // 驗證 token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // 從數據庫獲取最新的用戶信息
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ? AND activation = "1"',
      [decoded.id]
    )

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    const user = users[0]

    // 返回用戶信息（不包含密碼）
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        account: user.account,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        sign_up_time: user.sign_up_time,
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      })
    }
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }
})

// 更新個人資料
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email, phone, birthday, portrait_path } = req.body
  const userId = req.user.id

  try {
    // 1. 驗證必要欄位
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: '姓名和 Email 為必填欄位',
      })
    }

    // 2. 檢查 email 是否已被其他用戶使用
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email 已被其他用戶使用',
      })
    }

    // 3. 確認用戶存在且取得當前資料
    const [currentUser] = await db.query(
      'SELECT * FROM users WHERE id = ? AND activation = "1"',
      [userId]
    )

    if (currentUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在',
      })
    }

    // 4. 開始交易
    await db.query('START TRANSACTION')

    try {
      // 5. 準備更新資料
      const updateData = {
        name,
        email,
        phone: phone || null,
        birthday: birthday || null,
        portrait_path: portrait_path || null,
      }

      // 6. 更新用戶資料
      await db.query(
        `UPDATE users SET 
         name = ?, 
         email = ?, 
         phone = ?, 
         birthday = ?,

         portrait_path = ?
         WHERE id = ?`,
        [
          updateData.name,
          updateData.email,
          updateData.phone,
          updateData.birthday,
          updateData.portrait_path,
          userId,
        ]
      )

      // 7. 獲取更新後的用戶資料
      const [updatedUser] = await db.query(
        `SELECT id, name, account, email, phone, birthday,  
         portrait_path, role, sign_up_time 
         FROM users WHERE id = ?`,
        [userId]
      )

      // 8. 提交交易
      await db.query('COMMIT')

      // 9. 產生新的 token（包含更新後的資料）
      const token = jwt.sign(
        {
          id: updatedUser[0].id,
          role: updatedUser[0].role,
          account: updatedUser[0].account,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      )

      // 10. 回傳成功響應
      res.json({
        success: true,
        message: '個人資料更新成功',
        token, // 回傳新的 token
        user: updatedUser[0],
      })
    } catch (error) {
      // 如果出錯，回滾交易
      await db.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: '更新個人資料失敗',
    })
  }
})

// 獲取當前用戶的所有地址
router.get('/address', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM address WHERE user_id = ? AND deleted IS NULL ORDER BY defaultAdd DESC',
      [req.user.id]
    )

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch addresses error:', error)
    res.status(500).json({
      success: false,
      message: '獲取地址資料失敗',
    })
  }
})

// 新增地址
router.post('/address', authenticateToken, async (req, res) => {
  const { name, phone, address } = req.body

  try {
    // 檢查必要欄位
    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: '所有欄位都必須填寫',
      })
    }

    // 檢查是否有其他地址
    const [existingAddresses] = await db.query(
      'SELECT COUNT(*) as count FROM address WHERE user_id = ? AND deleted IS NULL',
      [req.user.id]
    )

    // 如果是第一個地址，設為預設
    const isDefault = existingAddresses[0].count === 0 ? 1 : 0

    // 取得當前時間
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // 新增地址
    const [result] = await db.query(
      'INSERT INTO address (user_id, name, phone, address, defaultAdd, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, phone, address, isDefault, now, now]
    )

    res.status(201).json({
      success: true,
      message: '新增地址成功',
      data: {
        id: result.insertId,
        user_id: req.user.id,
        name,
        phone,
        address,
        defaultAdd: isDefault,
        createdAt: now,
        updatedAt: now,
      },
    })
  } catch (error) {
    console.error('Add address error:', error)
    res.status(500).json({
      success: false,
      message: '新增地址失敗',
    })
  }
})

// 更新地址
router.put('/address/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { name, phone, address } = req.body

  try {
    // 確認地址存在且屬於當前用戶
    const [existingAddress] = await db.query(
      'SELECT * FROM address WHERE id = ? AND user_id = ? AND deleted IS NULL',
      [id, req.user.id]
    )

    if (existingAddress.length === 0) {
      return res.status(404).json({
        success: false,
        message: '地址不存在',
      })
    }

    // 更新地址
    await db.query(
      'UPDATE address SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, id]
    )

    res.json({
      success: true,
      message: '更新地址成功',
      data: {
        id: parseInt(id),
        user_id: req.user.id,
        name,
        phone,
        address,
        defaultAdd: existingAddress[0].defaultAdd,
      },
    })
  } catch (error) {
    console.error('Update address error:', error)
    res.status(500).json({
      success: false,
      message: '更新地址失敗',
    })
  }
})

// 刪除地址 (軟刪除)
router.delete('/address/:id', authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    // 確認地址存在且屬於當前用戶
    const [existingAddress] = await db.query(
      'SELECT * FROM address WHERE id = ? AND user_id = ? AND deleted IS NULL',
      [id, req.user.id]
    )

    if (existingAddress.length === 0) {
      return res.status(404).json({
        success: false,
        message: '地址不存在',
      })
    }

    // 軟刪除地址
    await db.query(
      'UPDATE address SET deleted = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    )

    // 如果刪除的是預設地址，設置最早的地址為預設
    if (existingAddress[0].defaultAdd === 1) {
      const [remainingAddresses] = await db.query(
        'SELECT id FROM address WHERE user_id = ? AND deleted IS NULL ORDER BY id ASC LIMIT 1',
        [req.user.id]
      )

      if (remainingAddresses.length > 0) {
        await db.query('UPDATE address SET defaultAdd = 1 WHERE id = ?', [
          remainingAddresses[0].id,
        ])
      }
    }

    res.json({
      success: true,
      message: '刪除地址成功',
    })
  } catch (error) {
    console.error('Delete address error:', error)
    res.status(500).json({
      success: false,
      message: '刪除地址失敗',
    })
  }
})

// 設置預設地址
router.put('/address/:id/default', authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    // 確認地址存在且屬於當前用戶
    const [existingAddress] = await db.query(
      'SELECT * FROM address WHERE id = ? AND user_id = ? AND deleted IS NULL',
      [id, req.user.id]
    )

    if (existingAddress.length === 0) {
      return res.status(404).json({
        success: false,
        message: '地址不存在',
      })
    }

    // 開始事務
    await db.query('START TRANSACTION')

    // 將所有地址設為非預設
    await db.query(
      'UPDATE address SET defaultAdd = 0 WHERE user_id = ? AND deleted IS NULL',
      [req.user.id]
    )

    // 設置新的預設地址
    await db.query('UPDATE address SET defaultAdd = 1 WHERE id = ?', [id])

    // 提交事務
    await db.query('COMMIT')

    res.json({
      success: true,
      message: '設置預設地址成功',
    })
  } catch (error) {
    // 發生錯誤時回滾事務
    await db.query('ROLLBACK')
    console.error('Set default address error:', error)
    res.status(500).json({
      success: false,
      message: '設置預設地址失敗',
    })
  }
})

// 獲取當前用戶的所有訂單
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ?', [
      req.user.id,
    ])

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch orders error:', error)
    res.status(500).json({
      success: false,
      message: '獲取訂單資料失敗',
    })
  }
})

// 獲取所有用戶的訂單詳細資料
router.get('/orders/details', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        o.*,
        oi.id as item_id,
        oi.product_id,
        oi.amount,
        oi.that_time_price,
        c.name as coupon_name,
        (
          SELECT pp.file_name 
          FROM product_photo pp 
          WHERE pp.product_id = oi.product_id 
          LIMIT 1
        ) as photo_name,
        p.name as product_name
      FROM orders o
      LEFT JOIN orders_items oi ON o.id = oi.order_id
      LEFT JOIN coupon c ON o.coupon_id = c.id
      LEFT JOIN product p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.order_time DESC`,
      [req.user.id]
    )

    // 重組數據結構，將訂單項目組織到各自的訂單下
    const ordersMap = new Map()

    rows.forEach((row) => {
      if (!ordersMap.has(row.id)) {
        // 創建新的訂單對象
        const order = {
          id: row.id,
          status: row.status,
          payment: row.payment,
          delivery: row.delivery,
          delivery_address: row.delivery_address,
          delivery_name: row.delivery_name,
          delivery_phone: row.delivery_phone,
          note: row.note,
          order_time: row.order_time,
          total_price: row.total_price,
          coupon_id: row.coupon_id,
          coupon_name: row.coupon_name,
          items: [],
        }
        ordersMap.set(row.id, order)
      }

      // 如果有訂單項目，添加到對應訂單的items數組中
      if (row.item_id) {
        ordersMap.get(row.id).items.push({
          id: row.item_id,
          product_id: row.product_id,
          amount: row.amount,
          product_name: row.product_name,
          photo_name: row.photo_name,
          that_time_price: row.that_time_price,
        })
      }
    })

    res.json({
      success: true,
      data: Array.from(ordersMap.values()),
    })
  } catch (error) {
    console.error('Fetch order details error:', error)
    res.status(500).json({
      success: false,
      message: '獲取訂單詳細資料失敗',
    })
  }
})

// 獲取所有用戶的訂單（管理員專用）
router.get('/admin/all-orders', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT orders.*, users.username, users.email 
      FROM orders 
      JOIN users ON orders.user_id = users.id 
      ORDER BY orders.created_at DESC
    `)

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch all orders error:', error)
    res.status(500).json({
      success: false,
      message: '獲取所有訂單資料失敗',
    })
  }
})

// 獲取當前用戶的收藏課程資料
router.get('/collection/lesson', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ul.id, ul.user_id, ul.type, ul.item_id, l.name, l.price, l.description as des,  lp.file_name as img, ul.updatedAt as date
        FROM user_like ul 
        LEFT JOIN lesson l ON ul.item_id = l.id 
        LEFT JOIN lesson_photo lp ON ul.item_id = lp.lesson_id 
        WHERE ul.user_id = ? and ul.type = 'lesson'`,
      [req.user.id]
    )

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch collection lesson error:', error)
    res.status(500).json({
      success: false,
      message: '獲取收藏課程資料失敗',
    })
  }
})

// 獲取當前用戶的收藏商家資料
router.get('/collection/shop', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
            ul.id,
            ul.user_id,
            ul.type,
            ul.item_id,
            ul.updatedAt as date,
            s.name,
            s.phone,
            s.address,
            s.description,
            s.sign_up_time,
            s.logo_path,
            s.longitude,
            s.latitude,
            s.user_id as shop_user_id
        FROM user_like ul 
        LEFT JOIN shop s ON ul.item_id = s.id 
        WHERE ul.user_id = ? AND ul.type = 'shop'`,
      [req.user.id]
    )

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch collection shop error:', error)
    res.status(500).json({
      success: false,
      message: '獲取收藏商家資料失敗',
    })
  }
})

export default router
