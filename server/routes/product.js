import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

// 商品列表頁隨機取商品(加ORDER BY RAND())
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

// 商品細節
router.get('/details', async (req, res) => {
  const id = parseInt(req.query.id)
  try {
    // 查詢產品基本資料
    const [productRows] = await db.query('SELECT * FROM product WHERE id = ?', [
      id,
    ])
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product = productRows[0]

    // 查詢產品照片
    const [photoRows] = await db.query(
      'SELECT file_name FROM product_photo WHERE product_id = ? ORDER BY id ASC',
      [id]
    )

    // 查商品類別名稱
    const [product_class] = await db.query(
      'SELECT class_name FROM product_class WHERE id =?',
      [product.product_class_id]
    )

    // 查商家名稱
    const [product_shop_name] = await db.query(
      'SELECT name FROM shop WHERE id =?',
      [product.shop_id]
    )

    res.json({
      product,
      product_class,
      product_shop_name,
      photos: photoRows.map((row) => row.file_name),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' })
  }
})

// 猜你喜歡十個商品
router.get('/guessYouLike', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, 
        (SELECT file_name 
          FROM product_photo 
          WHERE product_photo.product_id = p.id 
          ORDER BY id ASC LIMIT 1) AS file_name
      FROM product p ORDER BY RAND() LIMIT 10
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 細節頁推薦課程
router.get('/featureLessons', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM lesson ORDER BY RAND() LIMIT 5
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 後台Admin按順序取商品
router.get('/admin', async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT p.*, 
  (SELECT file_name 
    FROM product_photo 
    WHERE product_photo.product_id = p.id 
    ORDER BY id ASC LIMIT 1) AS file_name,
  (SELECT class_name 
    FROM product_class 
    WHERE product_class.id = p.product_class_id ) AS class_name,
  (SELECT name 
    FROM shop 
    WHERE shop.id = p.shop_id ) AS shop_name
FROM product p
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 後台商家取自家商品
router.get('/shop', async (req, res) => {
  const sId = parseInt(req.query.sId)
  try {
    const [rows] = await db.query(
      `
SELECT p.*, 
  (SELECT file_name 
    FROM product_photo 
    WHERE product_photo.product_id = p.id 
    ORDER BY id ASC LIMIT 1) AS file_name
FROM product p WHERE shop_id = ?
`,
      [sId]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
