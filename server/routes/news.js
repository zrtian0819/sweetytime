import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(`SELECT * FROM articles WHERE id =?`, [id])
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: '拿不到細節資料' })
  }
})

export default router
