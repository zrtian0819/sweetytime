import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
import path from 'path'

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
            pp.file_name AS product_image
          FROM
            orders_items
          JOIN
            product AS pd ON orders_items.product_id = pd.id
          LEFT JOIN
            product_photo AS pp ON pd.id = pp.product_id
          WHERE
            orders_items.order_id = ?
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

// 更新商家資訊
router.put('/update/:userId', upload.single('photo'), async (req, res) => {
  const { userId } = req.params
  const { id, role, name, phone, address, description } = req.body
  if (!id || !role) {
    return res.status(400).json({ error: '缺少 id 或 role' })
  }
  try {
    // 取得使用者與商店資料
    const [user] = await db.execute(
      `
			SELECT users.*, shop.*
			FROM users
			JOIN shop ON users.id = shop.user_id
			WHERE users.id = ?
			`,
      [userId]
    )

    // 檢查使用者是否存在
    if (user.length === 0) {
      return res.status(404).json({ error: '商家資料不存在' })
    }

    // 驗證是否有權限更新資料
    if (req.user.id !== parseInt(userId, 10)) {
      return res.status(403).json({ error: '無權限修改此商家資料' })
    }

    let logoPath = user[0].logo_path
    if (req.file) {
      logoPath = req.file.filename
    }

    // 更新資料
    await db.execute(
      `
			UPDATE shop
			JOIN users ON shop.user_id = users.id
			SET shop.name = ?, shop.phone = ?, shop.address = ?, shop.description = ?, shop.logo_path = ?
			WHERE shop.id = ?
			`,
      [name, phone, address, description, logoPath, id]
    )

    res.json({ message: '商家資料更新成功' })
  } catch (error) {
    console.error('Error updating shop:', error)
    res
      .status(500)
      .json({ error: '無法更新商家資料，請稍後再試', details: error.message })
  }
})

export default router
