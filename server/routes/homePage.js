import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

//取得所有產品資訊的路由
router.get('/product', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得所有產品的照片
router.get('/product-photo', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM product_photo`)
    res.json(rows) //回傳第一張照片
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

//取得所有產品資訊的路由
router.get('/shop', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shop')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shop' })
  }
})

//取得所有產品資訊的路由
router.get('/teacher', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teacher')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' })
  }
})

//取得所有課程資訊的路由
router.get('/lesson', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lesson')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' })
  }
})

export default router
