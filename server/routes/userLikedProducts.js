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

router.post('/', async (req, res) => {
  const userId = parseInt(req.body.userId)
  const productId = parseInt(req.body.productId)
  console.log('userId: ' + userId + ' productId: ' + productId)
  try {
    const [rows] = await db.query(
      `SELECT * FROM user_like WHERE user_id = ? AND item_id = ? AND type = 'product'`,
      [userId, productId]
    )

    if (rows.length > 0) {
      await db.query(
        `DELETE FROM user_like WHERE user_id = ? AND item_id = ? AND type = 'product'`,
        [userId, productId]
      )
      res.json({ isFavorited: false })
    } else {
      await db.query(
        `INSERT INTO user_like (user_id, item_id, type) VALUES (?, ?, 'product')`,
        [userId, productId]
      )
      res.json({ isFavorited: true })
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error)
    res.status(500).json({ error: 'Failed to toggle favorite status' })
  }
})
export default router
