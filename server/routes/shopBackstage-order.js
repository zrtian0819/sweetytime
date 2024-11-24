import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
import bcrypt from 'bcrypt'

const router = express.Router()

// 設置圖片上傳路徑
const storage = multer.diskStorage({
  destination: '../client/public/photos/shop_logo',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

// 查詢商家訂單資訊
router.get('/orders/:usersId', async (req, res) => {
  const { usersId } = req.params

  try {
    // 查詢商家用戶資訊
    const [userShop] = await db.execute(
      `
      SELECT users.*, shop.id AS shop_id, shop.name AS shop_name
      FROM users
      JOIN shop ON users.id = shop.user_id
      WHERE users.id = ? AND users.role = 'shop'
      `,
      [usersId]
    )

    // 確認商家存在
    if (userShop.length === 0) {
      return res.status(404).json({ error: '此商家不存在' })
    }

    const shopId = userShop[0].shop_id

    // 查詢商家訂單資料
    const [orders] = await db.execute(
      `
      SELECT
        o.*,
        c.name AS coupon_name
      FROM
        orders AS o
      LEFT JOIN
        coupon AS c ON o.coupon_id = c.id
      WHERE
        o.shop_id = ?
      `,
      [shopId]
    )

    // 如果沒有訂單，返回空資料
    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: '此商家目前還沒有歷史訂單', orders: [] })
    }

    // 查詢每筆訂單的商品資料
    const ordersWithItems = await Promise.all(
      orders.map(async (order, index) => {
        const [items] = await db.execute(
          `
            SELECT
              orders_items.*,
              pd.id AS product_id,
              pd.name AS product_name,
              pd.price,
              MIN(pp.file_name) AS product_image
            FROM
              orders_items
            JOIN
              product AS pd ON orders_items.product_id = pd.id
            LEFT JOIN
              product_photo AS pp ON pd.id = pp.product_id
            WHERE
              orders_items.order_id = ?
            GROUP BY
              orders_items.id, pd.id
          `,
          [order.id]
        )

        return {
          orderNumber: index + 1, // 自增排序 ID
          ...order,
          items, // 每筆訂單包含的商品資料
        }
      })
    )

    // 返回商家及訂單資料
    res.json({
      shop: {
        id: shopId,
        name: userShop[0].shop_name,
        owner: userShop[0], // 商家用戶資料
      },
      orders: ordersWithItems,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: '無法獲取訂單資料，請稍後再試' })
  }
})

// 查詢商家資訊
router.get('/:usersId', async (req, res) => {
  const { usersId } = req.params

  try {
    const [userShop] = await db.execute(
      `
      SELECT users.*, shop.*
      FROM users
      JOIN shop ON users.id = shop.user_id
      WHERE users.id = ? AND users.role = 'shop'
      `,
      [usersId]
    )

    if (userShop.length === 0) {
      return res.status(404).json({ error: '商家不存在' })
    }

    res.json(userShop[0]) // 返回單一商家物件
  } catch (error) {
    console.error('Error fetching shop:', error)
    res.status(500).json({ error: '無法獲取商家資料' })
  }
})

//更新編輯頁資料
router.put('/update/:userId', upload.single('photo'), async (req, res) => {
  const { userId } = req.params
  const { name, phone, address, password, description } = req.body
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
                u.password = ?
            WHERE u.id = ?
        `,
      [name, phone, address, logoPath, description, password, userId]
    )
    res.json([shop])
  } catch (error) {
    res.status(500).json({ error: '更新商家失敗' })
  }
})

//orders用更新狀況
router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  try {
    const validStatuses = ['已接收訂單', '進行中', '運送中', '已完成']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: '無效的狀態' })
    }

    const [result] = await db.execute(
      `
    SELECT orders.status
    FROM orders WHERE id = ?
    `,
      [orderId]
    )

    if (result.length === 0) {
      return res.status(404).json({ error: '訂單未找到或無法更新' })
    }

    const [updateResult] = await db.execute(
      `
    UPDATE orders SET status = ? WHERE id = ?
    `,
      [status, orderId]
    )

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: '更新訂單狀態失敗' })
    }

    res.json({ message: '訂單狀態更新成功' })
  } catch (error) {
    console.error('更新訂單狀態失敗', error)
    res.status(500).json({ error: '無法更新訂單狀態，請稍後再試' })
  }
})

export default router
