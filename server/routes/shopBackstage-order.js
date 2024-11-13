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
    const [order] = await db.execute(`
            SELECT orders.* , orders_items.*
            FROM orders
            JOIN orders_items ON orders.id = orders_items.order_id
            `)
    res.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router
