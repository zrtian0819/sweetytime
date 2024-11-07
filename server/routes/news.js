import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

// 抓取所有文章
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        news.id, 
        news.title, 
        news.content, 
        product_class.class_name AS class_name,
        news.img_path,
        news.activation,
        news.createdAt,
        news.updatedAt 
      FROM news 
      JOIN product_class ON news.product_class_id = product_class.id`
    )
    res.json(rows)
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

// 抓取指定 ID 的新聞詳情
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    // 抓取指定 ID 的新聞資料
    const [newsRows] = await db.query(
      `SELECT 
        news.id, 
        news.title, 
        news.content, 
        product_class.class_name AS class_name,
        news.img_path,
        news.activation,
        news.createdAt,
        news.updatedAt
      FROM news 
      JOIN product_class ON news.product_class_id = product_class.id
      WHERE news.id = ?`,
      [id]
    )

    if (newsRows.length === 0) {
      return res.status(404).json({ error: '找不到文章' })
    }

    // 返回單一新聞資料
    res.json(newsRows[0])
  } catch (error) {
    console.error('找不到文章資料', error)
    res.status(500).json({ error: '找不到文章資料' })
  }
})

export default router
