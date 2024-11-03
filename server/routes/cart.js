import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/product', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/product/:id', async (req, res) => {
  const pid = req.params.id
  try {
    const [row] = await db.query(`SELECT * FROM product WHERE id=${pid}`)
    res.json(row)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
