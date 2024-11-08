import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lesson')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.post('/admin/:lessonId', async (req, res) => {
  const { lessonId } = req.params // 從路由參數取得 id
  try {
    const [row] = await db.query(
      `SELECT lesson.activation FROM lesson WHERE id=?`,
      [lessonId]
    )
    const status = row[0].activation == 1 ? '0' : '1'
    const [change] = await db.query(
      `UPDATE lesson SET activation = ? WHERE id = ?`,
      [status, lessonId]
    )
    res.json(status)
  } catch (error) {
    res.status(500).json({ error: '更新失敗' })
  }
})

router.post('/admin/update/:lessonId', async (req, res) => {
  const { lessonId } = req.params
  const {
    lessonName,
    selectType,
    selectTeacher,
    lessonPrice,
    time,
    classroom,
    location,
    status,
    description,
  } = req.body
  try {
    const [rows] = await db.query(
      `
            UPDATE lesson
            SET 
                name = ?,	product_class_id=?,teacher_id=?,price=?,start_date=?,classroom_name=?,location=?,activation=?,description=?
            WHERE id = ?
        `,
      [
        lessonName,
        selectType,
        selectTeacher,
        lessonPrice,
        time,
        classroom,
        location,
        status,
        description,
        lessonId,
      ]
    )
    res.json([rows])
  } catch (error) {
    res.status(500).json({ error: '更新課程失敗' })
  }
})

router.post('/admin/upload/:id', async (req, res) => {
  const { id } = req.params
  const { img_path } = req.body
  try {
    const [rows] = await db.query(
      `UPDATE lesson SET img_path = ? WHERE id = ?`,
      [img_path, id]
    )
    res.json(img_path)
  } catch (error) {
    res.status(500).json({ error: '更新照片失敗' })
  }
})

router.get('/admin', async (req, res) => {
  try {
    const [rows] = await db.query(
      ` SELECT
     lesson.id,
     lesson.name AS lesson_name,
     lesson.start_date,
     lesson.quota,
     lesson.activation,
     teacher.name AS teacher_name,
     product_class.class_name AS class_name
   FROM lesson 
   JOIN product_class ON lesson.product_class_id = product_class.id 
   JOIN teacher ON lesson.teacher_id = teacher.id
      `
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: '拿不到關聯的資料' })
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

router.get('/teacher', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT teacher.id,teacher.name FROM teacher`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: '拿不到老師資料' })
  }
})

router.get('/student', async (req, res) => {
  try {
    const [stu] =
      await db.query(`SELECT lesson_id, COUNT(user_id) AS student_count
       FROM student
       GROUP BY lesson_id`)
    res.json(stu)
  } catch (error) {
    res.status(500).json({ error: '拿不到學生資料' })
  }
})
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(`SELECT * FROM lesson WHERE id =?`, [id])
    const [photo_rows] = await db.query(
      `SELECT * FROM lesson_photo WHERE lesson_id =?`,
      [id]
    )
    const [teacher_rows] = await db.query(`SELECT * FROM teacher WHERE id=?`, [
      rows[0].teacher_id,
    ])
    const [type] = await db.query(`SELECT * FROM product_class WHERE id=?`, [
      rows[0].product_class_id,
    ])
    const [stu_rows] = await db.query(
      `SELECT * FROM student WHERE lesson_id=?`,
      [id]
    )
    res.json({
      lesson: rows,
      photo: photo_rows,
      teacher: teacher_rows,
      type: type,
      stu: stu_rows,
    })
  } catch (error) {
    res.status(500).json({ error: '拿不到細節資料' })
  }
})

export default router
