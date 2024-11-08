import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT p.*, 
  (SELECT file_name 
    FROM product_photo 
    WHERE product_photo.product_id = p.id 
    ORDER BY id ASC LIMIT 1) AS file_name
FROM product p
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
