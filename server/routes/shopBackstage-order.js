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

router.get('/', async (req, res) => {
  try {
    // 取得所有訂單資料
    const [orders] = await db.execute(`
      SELECT * FROM orders
    `)

    // 使用Promise.all以便同時查詢每筆訂單的訂單項目
    const ordersWithItems = await Promise.all(
      orders.map(async (order, index) => {
        // 根據order_id查詢訂單項目
        const [items] = await db.execute(
          `
          SELECT * FROM orders_items WHERE order_id = ?
        `,
          [order.id]
        )

        // 增加一個自增排序的ID屬性，保留UUID作為訂單編號
        return {
          orderNumber: index + 1, // 這是自增的排序ID，從1開始
          orderId: order.id, // 實際的UUID訂單編號
          ...order,
          items,
        }
      })
    )

    res.json(ordersWithItems)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router
