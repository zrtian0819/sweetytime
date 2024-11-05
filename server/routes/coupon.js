import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupon')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' })
  }
})
export default router