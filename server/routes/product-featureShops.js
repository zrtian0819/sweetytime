import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 8
  try {
    const [rows] = await db.query(
      `
        SELECT id, name, logo_path FROM shop ORDER BY RAND() LIMIT ?
      `,
      [limit]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
