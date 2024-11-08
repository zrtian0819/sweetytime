import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

// 更新新聞的上下架狀態
router.post('/admin/:newsId', async (req, res) => {
  const { newsId } = req.params // 從路由參數取得 id
  try {
    const [row] = await db.query(
      `SELECT news.activation FROM news WHERE id=?`,
      [newsId]
    )

    if (row.length === 0) {
      return res.status(404).json({ error: '找不到文章' })
    }

    const status = row[0].activation == 1 ? '0' : '1'
    await db.query(`UPDATE news SET activation = ? WHERE id = ?`, [
      status,
      newsId,
    ])

    res.json({ activation: status })
  } catch (error) {
    console.error('更新失敗', error)
    res.status(500).json({ error: '更新失敗' })
  }
})

router.get('/admin', async (req, res) => {
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
    res.status(500).json({ error: '找不到文章資料' })
  }
})

// 抓取指定 ID 的新聞詳情
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
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

    res.json(newsRows[0])
  } catch (error) {
    console.error('找不到文章資料', error)
    res.status(500).json({ error: '找不到文章資料' })
  }
})

export default router
