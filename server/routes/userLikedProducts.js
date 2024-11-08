import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const id = parseInt(req.query.userId)
  try {
    const [rows] = await db.query(
      `
SELECT * FROM user_like WHERE user_id = ? AND type = ?
`,
      [id, 'product']
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
