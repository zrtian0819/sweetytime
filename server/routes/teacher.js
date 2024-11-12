import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// 使用 `multer` 保持原檔名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../client/public/photos/teachers')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // 使用原始檔名
  },
})

const upload = multer({ storage: storage })

// 抓取所有教師資料
router.get('/', async (req, res) => {
  const { keyword, status } = req.query
  const params = []
  let query = 'SELECT * FROM teacher WHERE 1=1'

  if (keyword) {
    query += ' AND (name LIKE ? OR expertise LIKE ?)'
    const likeKeyword = `%${keyword}%`
    params.push(likeKeyword, likeKeyword)
  }

  if (status === 'active') {
    query += ' AND activation = 1'
  } else if (status === 'inactive') {
    query += ' AND activation = 0'
  }

  try {
    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' })
  }
})

// 抓取特定教師詳細資料
router.get('/teacherDetail/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query('SELECT * FROM teacher WHERE id = ?', [id])
    if (rows.length > 0) {
      // 確保 `img_path` 僅包含檔名，並在前端顯示時拼接完整路徑
      rows[0].img_path = rows[0].img_path || 'default.png'
      res.json(rows[0])
    } else {
      res.status(404).json({ error: 'Teacher not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher detail' })
  }
})

// 切換教師啟用狀態
router.put('/toggleStatus/:id', async (req, res) => {
  const { id } = req.params
  const { activation } = req.body

  try {
    const [result] = await db.query(
      'UPDATE teacher SET activation = ? WHERE id = ?',
      [activation, id]
    )
    if (result.affectedRows > 0) {
      res.json({
        message: 'Teacher status updated successfully',
        newStatus: activation,
      })
    } else {
      res.status(404).json({ error: 'Teacher not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher status' })
  }
})

// 新增教師資料
router.post('/', upload.single('img_path'), async (req, res) => {
  const {
    title,
    name,
    description,
    expertise,
    experience,
    education,
    licence,
    awards,
    activation,
  } = req.body
  const imgPath = req.file ? req.file.originalname : 'default.png'

  try {
    const [result] = await db.query(
      'INSERT INTO teacher (title, name, description, expertise, experience, education, licence, awards, activation, img_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        name,
        description,
        expertise,
        experience,
        education,
        licence,
        awards,
        activation || 0,
        imgPath, // 儲存檔名
      ]
    )

    if (result.affectedRows > 0) {
      res.json({
        message: 'Teacher added successfully',
        teacherId: result.insertId,
      })
    } else {
      res.status(400).json({ error: 'Failed to add teacher' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add teacher' })
  }
})

// 更新教師資料
router.put('/:id', upload.single('img_path'), async (req, res) => {
  const { id } = req.params
  const {
    title,
    name,
    description,
    expertise,
    experience,
    education,
    licence,
    awards,
    img_path,
    activation,
  } = req.body

  const imgPath = req.file ? req.file.originalname : req.body.img_path
  try {
    const [result] = await db.query(
      'UPDATE teacher SET title = ?, name = ?, description = ?, expertise = ?, experience = ?, education = ?, licence = ?, awards = ?, activation = ?, img_path = ? WHERE id = ?',
      [
        title,
        name,
        description,
        expertise,
        experience,
        education,
        licence,
        awards,
        activation || 0,
        imgPath, // 儲存檔名
        id,
      ]
    )

    if (result.affectedRows > 0) {
      res.json({ message: 'Teacher updated successfully' })
    } else {
      res.status(404).json({ error: 'Teacher not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher' })
  }
})

export default router
