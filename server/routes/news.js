import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination: '../client/public/photos/articles', // 儲存圖片的資料夾路徑
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // 以時間戳+原檔名命名文件
  },
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

router.post(
  '/admin/upload',
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  async (req, res) => {
    const filename = req.files['photo'][0].filename
    const { title, description, selectType, status, time } = req.body
    try {
      const [rows] = await db.query(
        `INSERT INTO news (id, title, content, product_class_id, img_path, activation, createdAt) 
          VALUES (NULL, ?, ?, ?, ?, ?, ?)`,
        [title, description, selectType, filename, status, time]
      )

      res.json([rows])
    } catch (error) {
      console.error('文章新增失敗', error)
      res.status(500).json({ error: '新增文章失敗' })
    }
  }
)

router.post('/admin/:newsId', async (req, res) => {
  const { newsId } = req.params
  try {
    const [row] = await db.query(
      `SELECT news.activation FROM news WHERE id=?`,
      [newsId]
    )
    const status = row[0].activation == 1 ? '0' : '1'
    const [change] = await db.query(
      `UPDATE news SET activation = ? WHERE id = ?`,
      [status, newsId]
    )

    res.json(status)
  } catch (error) {
    console.error('更新失敗', error)
    res.status(500).json({ error: '更新失敗' })
  }
})

// 刪除文章的路由
router.delete('/admin/del/:newsId', async (req, res) => {
  const { newsId } = req.params
  try {
    const [result] = await db.query(`DELETE FROM news WHERE id = ?`, [newsId])

    // 檢查是否成功刪除
    if (result.affectedRows > 0) {
      res.json({ message: '刪除成功' })
    } else {
      res.status(404).json({ error: '找不到該新聞資料' })
    }
  } catch (error) {
    console.error('刪除失敗', error)
    res.status(500).json({ error: '刪除失敗' })
  }
})

router.post('/admin/update/:newsId', async (req, res) => {
  const { newsId } = req.params
  const { title, content, selectType, time, status } = req.body
  try {
    const [rows] = await db.query(
      `
            UPDATE news
            SET 
                title = ?,content = ?,product_class_id=?,activation=?,createdAt=?
            WHERE id = ?
        `,
      [title, content, selectType, status, time, newsId]
    )
    res.json([rows])
    console.log(req.body)
  } catch (error) {
    res.status(500).json({ error: '更新文章失敗' })
    console.log(req.body)
  }
})

router.post('/admin/upload/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params
  const filename = req.file.filename
  try {
    const [rows] = await db.query(`UPDATE news SET img_path = ? WHERE id = ?`, [
      filename,
      id,
    ])
    res.json(filename)
  } catch (error) {
    res.status(500).json({ error: '更新照片失敗' })
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

router.get('/type', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM product_class`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: '拿不到類別資料' })
  }
})

// 抓取指定 ID 的文章詳情(後台編輯用)
router.get('/admin/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(`SELECT * FROM news WHERE id = ?`, [id])
    const [type] = await db.query(`SELECT * FROM product_class WHERE id=?`, [
      rows[0].product_class_id,
    ])
    res.json({
      news: rows,
      type: type,
    })
  } catch (error) {
    console.error('找不到文章資料', error)
    res.status(500).json({ error: '找不到文章資料' })
  }
})

// 抓取指定 ID 的文章詳情
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
      return res.status(404).json({ error: 'News not found' })
    }
    res.json(newsRows[0])
  } catch (error) {
    res.status(500).json({ error: '找不到文章資料' })
  }
})

export default router
