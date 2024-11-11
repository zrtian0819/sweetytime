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

// 獲取所有商家
router.get('/', async (req, res) => {
  try {
    const [shop] = await db.execute(`
      SELECT shop.*, users.activation
      FROM shop
      JOIN users ON shop.user_id = users.id
      WHERE users.role = 'shop'
    `)
    res.json(shop)
  } catch (error) {
    console.error('Error fetching shops:', error)
    res.status(500).json({ error: 'Failed to fetch shops' })
  }
})

// 根據 shopId 獲取特定商家
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

//新增商家
router.post(
  '/admin/upload',
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  async (req, res) => {
    if (!req.files || !req.files['photo'] || req.files['photo'].length === 0) {
      return res.status(400).json({ error: '請上傳一張照片' })
    }

    const filename = req.files['photo'][0].filename
    const { shopName, phone, address, description, userId, status } = req.body

    // 開始 SQL 事務
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const [shopRows] = await connection.query(
        `INSERT INTO shop (id, user_id, name, phone, address, description, sign_up_time, logo_path) 
         VALUES (NULL, ?, ?, ?, ?, ?, NOW(), ?)`,
        [userId, shopName, phone, address, description, filename]
      )

      await connection.query(`UPDATE users SET activation = ? WHERE id = ?`, [
        status,
        userId,
      ])

      await connection.commit()
      res.json({ message: '新增商家成功', data: shopRows })
      console.log('Rows affected:', shopRows.affectedRows)
    } catch (error) {
      await connection.rollback()
      console.error('新增商家失敗', error)
      res.status(500).json({ error: '新增商家失敗' })
    } finally {
      // 釋放連接
      connection.release()
    }
  }
)

//更新編輯頁資料
router.post(
  '/admin/update/:shopId',
  upload.single('photo'),
  async (req, res) => {
    const { shopId } = req.params
    const { shopName, phone, address, status, description } = req.body
    const logoPath = req.file ? req.file.filename : null
    try {
      const [shop] = await db.query(
        `
            UPDATE shop AS s 
            JOIN users AS u ON s.user_id = u.id
            SET 
                s.name = ?,	
                s.phone=?,
                s.address=?,
                s.logo_path=?,
                s.description=?,
                u.activation=?
            WHERE s.id = ?
        `,
        [shopName, phone, address, logoPath, description, status, shopId]
      )
      res.json([shop])
    } catch (error) {
      res.status(500).json({ error: '更新商家失敗' })
    }
  }
)

//編輯頁照片更新
router.post('/admin/upload/:id', upload.single('photo'), async (req, res) => {
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
