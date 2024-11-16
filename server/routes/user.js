import express from 'express'
import db from '#configs/mysql.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// 確保上傳目錄存在
const uploadDir = path.join(process.cwd(), '..', 'client', 'public', 'photos', 'user')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 設定 multer 的存儲選項
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      'user-' +
        req.user.id +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    )
  },
})

// 設定檔案過濾器
const fileFilter = (req, file, cb) => {
  // 允許的檔案類型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支援的檔案類型。只允許 JPG, PNG 與 GIF 圖片'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制 2MB
  },
})

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

// 獲取所有使用者
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
          portrait_path: user.portrait_path,
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

// 獲取所有使用者 蘇增加
router.get('/regular-users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = "user"')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching regular users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// 更新用戶啟用狀態的路由
router.put('/:userId/toggleStatus', async (req, res) => {
  const { userId } = req.params
  const { activation } = req.body

  try {
    const [result] = await db.query(
      'UPDATE users SET activation = ? WHERE id = ?',
      [activation, userId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '用戶未找到' })
    }

    res.json({ success: true, message: '用戶啟用狀態更新成功' })
  } catch (error) {
    console.error('更新用戶狀態失敗:', error)
    res.status(500).json({ error: '更新用戶狀態失敗' })
  }
})
// 獲取所有使用者 蘇增加結束線

// Google 登入
router.post('/google-login', async (req, res) => {
  console.log('Received Google login request body:', req.body)

  const { googleUser } = req.body

  try {
    // 驗證必要的數據
    if (!googleUser || !googleUser.sub || !googleUser.email) {
      return res.status(400).json({
        success: false,
        message: '無效的 Google 用戶資料',
      })
    }

    // 開始資料庫操作
    await db.query('START TRANSACTION')

    try {
      // 查找現有用戶
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE google_id = ? OR email = ?',
        [googleUser.sub, googleUser.email]
      )

      let userData

      if (existingUsers.length === 0) {
        // 創建新用戶
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const [result] = await db.query(
          `INSERT INTO users 
          (name, email, google_id, google_email, role, activation, sign_up_time) 
          VALUES (?, ?, ?, ?, 'user', 1, ?)`,
          [
            googleUser.name,
            googleUser.email,
            googleUser.sub,
            googleUser.email,
            now,
          ]
        )

        const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [
          result.insertId,
        ])
        userData = newUser[0]
      } else {
        userData = existingUsers[0]
        // 更新現有用戶的 Google 信息
        await db.query(
          `UPDATE users 
          SET google_id = ?, google_email = ?, name = COALESCE(name, ?)
          WHERE id = ?`,
          [googleUser.sub, googleUser.email, googleUser.name, userData.id]
        )
      }

      // 生成 JWT token
      const token = jwt.sign(
        {
          id: userData.id,
          role: userData.role,
          account: userData.account || userData.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      )

      await db.query('COMMIT')

      // 返回用戶資料
      res.json({
        success: true,
        message: '登入成功',
        token,
        user: {
          id: userData.id,
          name: userData.name,
          role: userData.role,
          account: userData.account || userData.email,
          email: userData.email,
          phone: userData.phone,
          birthday: userData.birthday,
          sign_up_time: userData.sign_up_time,
        },
      })
    } catch (error) {
      await db.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Google login server error:', error)
    res.status(500).json({
      success: false,
      message: 'Google 登入處理失敗',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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
        portrait_path: user.portrait_path,
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

router.post(
  '/upload-avatar',
  authenticateToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '沒有上傳檔案',
        })
      }

      // 取得檔案名稱
      const fileName = req.file.filename

      // 開始資料庫交易
      await db.query('START TRANSACTION')

      try {
        // 更新使用者的頭像路徑
        const [result] = await db.query(
          'UPDATE users SET portrait_path = ? WHERE id = ?',
          [fileName, req.user.id]
        )

        // 取得更新後的使用者資料
        const [updatedUser] = await db.query(
          'SELECT id, name, account, email, phone, birthday, portrait_path, role, sign_up_time FROM users WHERE id = ?',
          [req.user.id]
        )

        // 提交交易
        await db.query('COMMIT')

        // 產生新的 token
        const token = jwt.sign(
          {
            id: updatedUser[0].id,
            role: updatedUser[0].role,
            account: updatedUser[0].account,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        )

        res.json({
          success: true,
          message: '頭像上傳成功',
          data: {
            portrait_path: fileName,
            user: updatedUser[0],
          },
          token,
        })
      } catch (error) {
        // 如果出錯，回滾交易並刪除上傳的檔案
        await db.query('ROLLBACK')
        // 清理上傳的檔案
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        throw error
      }
    } catch (error) {
      console.error('Upload avatar error:', error)
      // 清理上傳的檔案
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      res.status(500).json({
        success: false,
        message: error.message || '頭像上傳失敗',
      })
    }
  }
)

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

// 獲取當前用戶的訂單詳細資料
router.get('/orders/details', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        o.id,o.status,
        o.user_id,
        o.shop_id,
        o.coupon_id,
        o.payment,
        o.delivery,
        o.delivery_address,
        o.delivery_name,
        o.delivery_phone,
        o.note,
        o.order_time,
        o.total_price,
        o.ship_pay,
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
        p.name as product_name,
        s.name as shop_name
      FROM orders o
      LEFT JOIN orders_items oi ON o.id = oi.order_id
      LEFT JOIN coupon c ON o.coupon_id = c.id
      LEFT JOIN product p ON oi.product_id = p.id
      LEFT JOIN shop s ON o.shop_id = s.id
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
          shop_name: row.shop_name,
          ship_pay: row.ship_pay,
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

// 獲取當前用戶的所有課程訂單
router.get('/orders/lesson', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM student WHERE user_id = ?', [
      req.user.id,
    ])

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error('Fetch lesson orders error:', error)
    res.status(500).json({
      success: false,
      message: '獲取課程訂單資料失敗',
    })
  }
})

// 獲取當前用戶的課程訂單詳細資料
router.get('/orders/lesson/details', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.* FROM student s WHERE s.user_id = ?`,
      [req.user.id]
    )

    // 重組數據結構，將訂單項目組織到各自的訂單下
    const ordersMap = new Map()

    rows.forEach((row) => {
      if (!ordersMap.has(row.id)) {
        // 創建新的訂單對象
        const order = {
          id: row.id,
          order_id: row.order_id,
          user_id: row.user_id,
          lesson_id: row.lesson_id,
          sign_up_time: row.sign_up_time,
          canceled_time: row.canceled_time,
          order_info: row.order_info,
          reservation: row.reservation,
          transaction_id: row.transaction_id,
        }
        ordersMap.set(row.id, order)
      }
    })

    res.json({
      success: true,
      data: Array.from(ordersMap.values()),
    })
  } catch (error) {
    console.error('Fetch lesson order details error:', error)
    res.status(500).json({
      success: false,
      message: '獲取課程訂單詳細資料失敗',
    })
  }
})

// 獲取當前用戶的收藏課程資料
router.get('/collection/lesson', authenticateToken, async (req, res) => {
  const { page = 1, search = '', limit = 6 } = req.query;
  
  try {
    let query = `
      SELECT 
        ul.id, ul.user_id, ul.type, ul.item_id, l.name, l.price,
        (
            SELECT lp.file_name 
            FROM lesson_photo lp 
            WHERE lp.lesson_id = ul.item_id 
            LIMIT 1
        ) as img,
        ul.updatedAt as date
      FROM user_like ul
      LEFT JOIN lesson l ON ul.item_id = l.id
      WHERE ul.user_id = ? 
      AND ul.type = 'lesson'
    `;
    
    const params = [req.user.id];
    
    if (search) {
      query += ` AND l.name LIKE ?`;
      params.push(`%${search}%`);
    }
    
    query += ` GROUP BY ul.item_id`;
    
    // 添加分頁
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [rows] = await db.query(query, params);
    
    // 計算總數
    const [countResult] = await db.query(
      `SELECT COUNT(DISTINCT ul.item_id) as total 
       FROM user_like ul 
       LEFT JOIN lesson l ON ul.item_id = l.id 
       WHERE ul.user_id = ? 
       AND ul.type = 'lesson'
       ${search ? 'AND l.name LIKE ?' : ''}`,
      search ? [req.user.id, `%${search}%`] : [req.user.id]
    );
    
    const totalPages = Math.ceil(countResult[0].total / limit);
    
    res.json({
      success: true,
      data: rows,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Fetch collection lesson error:', error);
    res.status(500).json({
      success: false,
      message: '獲取收藏課程資料失敗'
    });
  }
});

// 獲取當前用戶的收藏商家資料
router.get('/collection/shop', authenticateToken, async (req, res) => {
  const { page = 1, search = '', limit = 6 } = req.query;
  
  try {
    let query = `
      SELECT 
        ul.id, ul.user_id, ul.type, ul.item_id, ul.updatedAt as date,
        s.name, s.phone, s.address, s.description, s.sign_up_time,
        s.logo_path, s.longitude, s.latitude, s.user_id as shop_user_id
      FROM user_like ul 
      LEFT JOIN shop s ON ul.item_id = s.id 
      WHERE ul.user_id = ? AND ul.type = 'shop'
    `;
    
    const params = [req.user.id];
    
    if (search) {
      query += ` AND s.name LIKE ?`;
      params.push(`%${search}%`);
    }
    
    // 添加分頁
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [rows] = await db.query(query, params);
    
    // 獲取總數以計算總頁數
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM user_like ul 
       LEFT JOIN shop s ON ul.item_id = s.id 
       WHERE ul.user_id = ? AND ul.type = 'shop'
       ${search ? 'AND s.name LIKE ?' : ''}`,
      search ? [req.user.id, `%${search}%`] : [req.user.id]
    );
    
    const totalPages = Math.ceil(countResult[0].total / limit);
    
    res.json({
      success: true,
      data: rows,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Fetch collection shop error:', error);
    res.status(500).json({
      success: false,
      message: '獲取收藏商家資料失敗'
    });
  }
});

// 獲取當前用戶的收藏商品資料
router.get('/collection/product', authenticateToken, async (req, res) => {
  const { page = 1, search = '', limit = 6 } = req.query;
  
  try {
    let query = `
      SELECT 
        ul.id, ul.user_id, ul.type, ul.item_id,
        p.*, 
        (
          SELECT pp.file_name 
          FROM product_photo pp 
          WHERE pp.product_id = p.id 
          LIMIT 1
        ) as img
      FROM user_like ul 
      LEFT JOIN product p ON ul.item_id = p.id
      WHERE ul.user_id = ? 
      AND ul.type = 'product'
    `;
    
    const params = [req.user.id];
    
    if (search) {
      query += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }
    
    query += ` GROUP BY ul.item_id`;
    
    // 添加分頁
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const [rows] = await db.query(query, params);
    
    // 計算總數以獲得總頁數
    const [countResult] = await db.query(
      `SELECT COUNT(DISTINCT ul.item_id) as total 
       FROM user_like ul 
       LEFT JOIN product p ON ul.item_id = p.id 
       WHERE ul.user_id = ? 
       AND ul.type = 'product'
       ${search ? 'AND p.name LIKE ?' : ''}`,
      search ? [req.user.id, `%${search}%`] : [req.user.id]
    );
    
    const totalPages = Math.ceil(countResult[0].total / limit);
    
    res.json({
      success: true,
      data: rows,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Fetch collection product error:', error);
    res.status(500).json({
      success: false,
      message: '獲取收藏商品資料失敗'
    });
  }
});

// 新增收藏
router.post('/like', authenticateToken, async (req, res) => {
  const { type, item_id } = req.body
  const user_id = req.user.id

  try {
    const [result] = await db.query(
      'INSERT INTO user_like (user_id, type, item_id) VALUES (?, ?, ?)',
      [user_id, type, item_id]
    )

    res.json({
      success: true,
      message: '收藏成功',
    })
  } catch (error) {
    console.error('Add like error:', error)
    res.status(500).json({
      success: false,
      message: '新增收藏失敗',
    })
  }
})

// 刪除收藏
router.delete('/collection/:type/:id', authenticateToken, async (req, res) => {
  const { type, id } = req.params
  const user_id = req.user.id

  try {
    const [result] = await db.query(
      'DELETE FROM user_like WHERE user_id = ? AND type = ? AND id = ?',
      [user_id, type, id]
    )

    res.json({
      success: true,
      message: '取消收藏成功',
    })
  } catch (error) {
    console.error('Delete like error:', error)
    res.status(500).json({
      success: false,
      message: '取消收藏失敗',
    })
  }
})

export default router
