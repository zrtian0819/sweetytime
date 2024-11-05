import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT p.*, pp.file_name 
FROM (
  SELECT * FROM product ORDER BY RAND() LIMIT 12
) p
LEFT JOIN (
  SELECT product_id, file_name 
  FROM product_photo 
  ORDER BY id ASC
) pp ON p.id = pp.product_id
GROUP BY p.id
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
