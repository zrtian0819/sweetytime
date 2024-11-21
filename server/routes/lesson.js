import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
import { sendOrderConfirmation } from '../SMTP/lesson.js'
const router = express.Router()

const storage = multer.diskStorage({
  destination: '../client/public/photos/lesson', // 儲存圖片的資料夾路徑
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // 以時間戳+原檔名命名文件
  },
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lesson')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/front', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT lesson.*, teacher.name AS teacher_name
      FROM lesson
      JOIN teacher ON lesson.teacher_id = teacher.id
      WHERE lesson.activation = 1 AND teacher.activation = 1`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.post(
  '/admin/upload',
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  async (req, res) => {
    const filename = req.files['photo'][0].filename
    const {
      lessonName,
      selectType,
      selectTeacher,
      lessonPrice,
      time,
      classroom,
      location,
      status,
      quota,
      description,
    } = req.body
    try {
      const [rows] = await db.query(
        `INSERT INTO lesson (id, teacher_id, product_class_id, name, img_path, price, start_date, classroom_name, location, description, quota, activation) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          selectTeacher,
          selectType,
          lessonName,
          filename,
          lessonPrice,
          time,
          classroom,
          location,
          description,
          quota,
          status,
        ]
      )
      res.json({ lessonId: rows.insertId })
    } catch (error) {
      res.status(500).json({ error: '新增課程失敗' })
    }
  }
)

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

//更新封面照片
router.post('/admin/upload/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params
  const filename = req.file.filename
  try {
    const [rows] = await db.query(
      `UPDATE lesson SET img_path = ? WHERE id = ?`,
      [filename, id]
    )
    res.json(filename)
  } catch (error) {
    res.status(500).json({ error: '更新照片失敗' })
  }
})

// 新增多張新照片
router.post(
  '/admin/uploadDetail/:id',
  upload.array('photos'),
  async (req, res) => {
    const { id } = req.params
    console.log(req.files)
    try {
      // 遍歷所有檔案並插入資料庫
      for (let file of req.files) {
        const filename = file.filename
        await db.query(
          `INSERT INTO lesson_photo (id, lesson_id, file_name, is_valid) VALUES (NULL, ?, ?, '1');`,
          [id, filename]
        )
      }
      res.status(200).json({ message: '照片上傳成功' })
    } catch (error) {
      res.status(500).json({ error: '上傳細節照片失敗' })
    }
  }
)

// 編輯多張新照片
router.post(
  '/admin/uploadDetail/:id',
  upload.array('photos'),
  async (req, res) => {
    const { id } = req.params

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '請上傳至少一張照片' })
    }

    try {
      // 遍歷所有檔案並插入資料庫
      for (let file of req.files) {
        const filename = file.filename

        await db.query(
          `INSERT INTO lesson_photo (id, lesson_id, file_name, is_valid) VALUES (NULL, ?, ?, '1');`,
          [id, filename]
        )
      }
      res.status(200).json({ message: '照片上傳成功' })
    } catch (error) {
      res.status(500).json({ error: '上傳細節照片失敗' })
    }
  }
)
// 刪除照片
router.post('/admin/deleteDetail/:id', async (req, res) => {
  const { id } = req.params
  console.log(req.body)
  const { files_name } = req.body
  try {
    await db.query(
      `UPDATE lesson_photo SET is_valid = '0' WHERE lesson_id = ? AND lesson_photo.file_name NOT IN (?);`,
      [id, files_name]
    )
    res.status(200).json({ message: '刪除成功！' })
  } catch (error) {
    res.status(500).json({ error: '刪除照片失敗' })
  }
})

router.post('/like/:id', async (req, res) => {
  const { id } = req.params
  const { user, time } = req.body
  const [rows] = await db.query(
    `INSERT INTO user_like (id, user_id, type, item_id,	createdAt) VALUES (NULL, ?, 'lesson', ?,?);`,
    [user, id, time]
  )
  res.status(200).json({ message: id, user })
})

router.post('/likeDel/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req.body
  const [rows] = await db.query(
    `DELETE FROM user_like WHERE user_id =? AND item_id = ?`,
    [user, id]
  )
  res.status(200).json({ message: id, user })
})

router.post('/getLike/:id', async (req, res) => {
  const { id } = req.params
  const [rows] = await db.query(`SELECT * FROM user_like WHERE user_id =?`, [
    id,
  ])
  res.status(200).json({ rows })
})

router.post('/sendMail', async (req, res) => {
  console.log(req.body)
  const { lesson } = req.body
  const { userMail } = req.body
  try {
    await sendOrderConfirmation(userMail, lesson)
    res.status(200).send({ message: '已發信成功' })
  } catch (error) {
    res.status(500).send({ message: '發信失敗' })
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
     teacher.activation AS teacher_activation,
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

router.get('/student/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [stu] = await db.query(
      `SELECT lesson_id, COUNT(user_id) AS student_count, 
        GROUP_CONCAT(user_id) AS student_ids
       FROM student
       WHERE lesson_id =?`,
      [id]
    )
    const result = stu.map((row) => ({
      ...row,
      student_ids: row.student_ids ? row.student_ids.split(',') : [],
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ error: '拿不到學生資料' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(`SELECT * FROM lesson WHERE id =?`, [id])
    const [photo_rows] = await db.query(
      `SELECT * FROM lesson_photo WHERE lesson_id =? AND is_valid=1`,
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
