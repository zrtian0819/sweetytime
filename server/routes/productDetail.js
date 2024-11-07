import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
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

    const [product_class] = await db.query(
      'SELECT class_name FROM product_class WHERE id =?',
      [product.product_class_id]
    )

    res.json({
      product,
      product_class,
      photos: photoRows.map((row) => row.file_name),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' })
  }
})
export default router
