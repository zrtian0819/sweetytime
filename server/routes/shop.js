import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination: '../client/public/photos/shop_logo',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

// 前台商家列表（隨機排序）
router.get('/frontend', async (req, res) => {
  try {
    const [shop] = await db.execute(`
      SELECT shop.*, users.activation
      FROM shop
      JOIN users ON shop.user_id = users.id
      WHERE users.role = 'shop'
      ORDER BY RAND(); 
    `)
    res.json(shop)
  } catch (error) {
    console.error('Error fetching shops for frontend:', error)
    res.status(500).json({ error: 'Failed to fetch shops for frontend' })
  }
})

// 後台商家列表（固定排序）
router.get('/admin', async (req, res) => {
  try {
    const [shop] = await db.execute(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY shop.id ASC) AS serialNumber,
        shop.*, 
        users.activation
      FROM shop
      JOIN users ON shop.user_id = users.id
      WHERE users.role = 'shop'
    `)
    res.json(shop)
  } catch (error) {
    console.error('Error fetching shops for admin:', error)
    res.status(500).json({ error: 'Failed to fetch shops for admin' })
  }
})

//admin後台用
router.get('/:shopId', async (req, res) => {
  const { shopId } = req.params
  try {
    const [shop] = await db.execute(
      `
      SELECT shop.*, users.activation 
      FROM shop 
      JOIN users ON shop.user_id = users.id
      WHERE shop.id = ? AND users.role = 'shop'
    `,
      [shopId]
    )
    if (shop.length === 0) {
      return res.status(404).json({ error: '商家不存在' })
    }

    res.json(shop[0]) // 只返回一個商家物件，而不是陣列
  } catch (error) {
    console.error('Error fetching shop:', error)
    res.status(500).json({ error: '無法獲取商家資料' })
  }
})

// 獲取特定店家的商品與照片
router.get('/:shopId/products', async (req, res) => {
  const { shopId } = req.params
  try {
    const [products] = await db.execute(
      `
      SELECT
        p.*,
        (SELECT file_name FROM product_photo 
         WHERE product_photo.product_id = p.id
         ORDER BY id ASC LIMIT 1) AS random_photos
      FROM product AS p
      JOIN shop AS s ON p.shop_id = s.id
      WHERE s.id = ?
      `,
      [shopId]
    )

    if (products.length === 0) {
      return res.status(404).json({ error: '此店家商品不存在' })
    }

    res.json(products)
  } catch (error) {
    console.error('Error fetching product:', error.message)
    res
      .status(500)
      .json({ error: '無法獲取店家商品資料', details: error.message })
  }
})

//新增店家用
router.post(
  '/admin/createShop',
  upload.single('logo_path'),
  async (req, res) => {
    const {
      account,
      password,
      name,
      phone,
      address,
      description,
      email = '',
    } = req.body

    try {
      const [existingUser] = await db.execute(
        `SELECT * FROM users WHERE account = ? AND role = 'shop'`,
        [account]
      )

      let userId
      if (existingUser.length === 0) {
        // 若不存在該帳號，新增用戶記錄
        const [newUser] = await db.execute(
          `INSERT INTO users (role, name, account, password, email, phone, sign_up_time, activation) VALUES ('shop', ?, ?, ?, ?, ?, NOW(), 1)`,
          [name, account, password, email, phone]
        )
        userId = newUser.insertId // 取得新增的用戶 ID
      } else {
        // 若已存在該帳號，使用用戶的 ID
        userId = existingUser[0].id
      }

      //新增商家資料至 shop 表
      const filename = req.file ? req.file.filename : null
      const [createdShop] = await db.execute(
        `INSERT INTO shop (user_id, name, phone, address, description, sign_up_time, logo_path) VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
        [userId, name, phone, address, description, filename]
      )

      if (createdShop.affectedRows > 0) {
        res.json({
          message: 'Teacher added successfully',
          teacherId: createdShop.insertId,
        })
      } else {
        res.status(400).json({ error: 'Failed to add shop' })
      }
    } catch (error) {
      console.error('新增商家失敗', error)
      res.status(500).json({ error: '新增商家失敗' })
    }
  }
)

//更新編輯頁資料
router.put(
  '/admin/update/:shopId',
  upload.single('photo'),
  async (req, res) => {
    const { shopId } = req.params
    const { name, phone, address, status, description } = req.body
    const logoPath = req.file ? req.file.filename : undefined
    try {
      const [shop] = await db.query(
        `
            UPDATE shop AS s 
            JOIN users AS u ON s.user_id = u.id
            SET 
                s.name = ?,	
                s.phone = ?,
                s.address = ?,
                s.logo_path = COALESCE(?, s.logo_path),
                s.description = ?,
                u.activation = ?
            WHERE s.id = ?
        `,
        [name, phone, address, logoPath, description, status, shopId]
      )
      res.json([shop])
    } catch (error) {
      res.status(500).json({ error: '更新商家失敗' })
    }
  }
)

router.put(
  '/admin/update/:shopId',
  upload.single('photo'),
  async (req, res) => {
    const { shopId } = req.params
    const { name, phone, address, status, description } = req.body
    const logoPath = req.file ? req.file.filename : undefined
    try {
      const [shop] = await db.query(
        `
            UPDATE shop AS s
            JOIN users AS u ON s.user_id = u.id
            SET
                s.name = ?,
                s.phone = ?,
                s.address = ?,
                s.logo_path = COALESCE(?, s.logo_path),
                s.description = ?,
                u.activation = ?
            WHERE s.id = ?
        `,
        [name, phone, address, logoPath, description, status, shopId]
      )
      res.json([shop])
    } catch (error) {
      res.status(500).json({ error: '更新商家失敗' })
    }
  }
)

//編輯頁照片更新
router.put('/admin/upload/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params
  const filename = req.file.filename
  try {
    const [shop] = await db.query(
      `UPDATE shop SET logo_path = ? WHERE id = ?`,
      [filename, id]
    )
    res.json(filename)
  } catch (error) {
    res.status(500).json({ error: '更新照片失敗' })
  }
})

// 切換商家啟用/停用狀態
router.put('/:shopId', async (req, res) => {
  const { shopId } = req.params

  try {
    // 查詢商家的 user_id
    const [shop] = await db.execute('SELECT user_id FROM shop WHERE id = ?', [
      shopId,
    ])
    if (shop.length === 0) {
      return res.status(404).json({ error: '此商家不存在' })
    }

    const userId = shop[0].user_id

    // 查詢當前的 activation 狀態
    const [user] = await db.execute(
      'SELECT activation FROM users WHERE id = ?',
      [userId]
    )
    if (user.length === 0) {
      return res.status(404).json({ error: '用戶不存在' })
    }

    const currentStatus = user[0].activation
    const newStatus = currentStatus ? 0 : 1

    // 更新 users 表中的 activation 狀態
    await db.execute('UPDATE users SET activation = ? WHERE id = ?', [
      newStatus,
      userId,
    ])

    res.json({ message: `商家狀態已${newStatus ? '啟用' : '停用'}`, newStatus })
  } catch (error) {
    console.error('Error updating shop activation status:', error)
    res.status(500).json({ error: '無法更新商家狀態' })
  }
})

export default router
