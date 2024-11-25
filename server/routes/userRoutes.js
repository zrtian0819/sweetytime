// routes/userRoutes.js
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import db from '#configs/mysql.js'
import express from 'express'

const router = express.Router()

// 配置 Multer 儲存
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = '../client/public/photos/user'
    // 確保目錄存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const userId = req.params.id
    const timestamp = new Date().getTime()
    const ext = path.extname(file.originalFilename || file.originalname)
    cb(null, `user_${userId}_${timestamp}${ext}`)
  },
})

// 檔案過濾器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支援 JPG、PNG 與 GIF 圖片格式'), false)
  }
}

// 配置 Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: fileFilter,
})

// 刪除舊照片的輔助函數
const deleteOldPhoto = (filename) => {
  if (!filename || filename === 'default.png') return

  const filePath = path.join(
    process.cwd(),
    'public',
    'photos',
    'user',
    filename
  )
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error('刪除舊照片失敗:', error)
    }
  }
}

// 中間件：處理上傳錯誤
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '檔案大小不能超過 2MB',
      })
    }
    return res.status(400).json({
      success: false,
      message: '檔案上傳失敗',
    })
  }
  next(error)
}

// API 路由
router.put(
  '/edit/:id',
  upload.single('image'),
  handleUploadError,
  async (req, res) => {
    const { id } = req.params
    const { name, email, phone, birthday, activation } = req.body

    try {
      // 1. 檢查使用者是否存在
      const [existingUser] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      )

      if (existingUser.length === 0) {
        // 如果有上傳新檔案但使用者不存在，刪除已上傳的檔案
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(404).json({
          success: false,
          message: '找不到使用者',
        })
      }

      // 2. 檢查 email 是否被其他用戶使用
      const [emailCheck] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      )

      if (emailCheck.length > 0) {
        // 如果有上傳新檔案但 email 重複，刪除已上傳的檔案
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(400).json({
          success: false,
          message: 'Email 已被其他用戶使用',
        })
      }

      // 3. 準備更新資料
      const updateData = {
        name: name || existingUser[0].name,
        email: email || existingUser[0].email,
        phone: phone || null,
        birthday: birthday || null,
        activation:
          activation !== undefined
            ? activation === 'true' || activation === '1'
              ? 1
              : 0
            : existingUser[0].activation,
        portrait_path: req.file
          ? path.basename(req.file.path)
          : existingUser[0].portrait_path,
      }

      // 如果有新照片，刪除舊照片
      if (req.file && existingUser[0].portrait_path) {
        deleteOldPhoto(existingUser[0].portrait_path)
      }

      // 4. 更新使用者資料
      const [result] = await db.query(
        `UPDATE users SET 
                name = ?, 
                email = ?, 
                phone = ?, 
                birthday = ?,
                activation = ?,
                portrait_path = ?
                WHERE id = ?`,
        [
          updateData.name,
          updateData.email,
          updateData.phone,
          updateData.birthday,
          updateData.activation,
          updateData.portrait_path,
          id,
        ]
      )

      // 5. 獲取更新後的使用者資料
      const [updatedUser] = await db.query(
        'SELECT id, name, account, email, phone, birthday, activation, portrait_path FROM users WHERE id = ?',
        [id]
      )

      // 6. 回傳更新後的資料
      res.json({
        success: true,
        message: '使用者資料更新成功',
        user: updatedUser[0],
      })
    } catch (error) {
      // 如果更新過程中發生錯誤，刪除已上傳的檔案
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }

      console.error('更新使用者資料失敗:', error)
      res.status(500).json({
        success: false,
        message: '更新使用者資料失敗',
      })
    }
  }
)

export default router
