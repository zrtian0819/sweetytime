import express from 'express'
const router = express.Router()

// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 驗証加密密碼字串用
import { compareHash } from '#db-helpers/password-hash.js'

// 上傳檔案用使用multer
import path from 'path'
import multer from 'multer'

// multer的設定值 - START
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // 存放目錄
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    // 經授權後，req.user帶有會員的id
    const newFilename = req.user.id
    // 新檔名由表單傳來的req.body.newFilename決定
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })
// multer的設定值 - END

// GET - 得到所有會員資料
router.get('/', async function (req, res) {
  const users = await User.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { users } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', authenticate, async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const user = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼
  delete user.password

  return res.json({ status: 'success', data: { user } })
})

// POST - 新增會員資料
router.post('/', async function (req, res) {
  // req.body資料範例
  // {
  //     "name":"金妮",
  //     "email":"ginny@test.com",
  //     "username":"ginny",
  //     "password":"12345"
  // }

  // 要新增的會員資料
  const newUser = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newUser.username ||
    !newUser.email ||
    !newUser.name ||
    !newUser.password
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 執行後user是建立的會員資料，created為布林值
  // where指的是不可以有相同的資料，如username或是email不能有相同的
  // defaults用於建立新資料用需要的資料
  const [user, created] = await User.findOrCreate({
    where: {
      [Op.or]: [{ username: newUser.username }, { email: newUser.email }],
    },
    defaults: {
      name: newUser.name,
      password: newUser.password,
      username: newUser.username,
      email: newUser.email,
    },
  })

  // 新增失敗 created=false 代表沒新增
  if (!created) {
    return res.json({ status: 'error', message: '建立會員失敗' })
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})

// POST - 可同時上傳與更新會員檔案用，使用multer(設定值在此檔案最上面)
router.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'), // 上傳來的檔案(這是單個檔案，表單欄位名稱為avatar)
  async function (req, res) {
    // req.file 即上傳來的檔案(avatar這個檔案)
    // req.body 其它的文字欄位資料…
    // console.log(req.file, req.body)

    if (req.file) {
      const id = req.user.id
      const data = { avatar: req.file.filename }

      // 對資料庫執行update
      const [affectedRows] = await User.update(data, {
        where: {
          id,
        },
      })

      // 沒有更新到任何資料 -> 失敗或沒有資料被更新
      if (!affectedRows) {
        return res.json({
          status: 'error',
          message: '更新失敗或沒有資料被更新',
        })
      }

      return res.json({
        status: 'success',
        data: { avatar: req.file.filename },
      })
    } else {
      return res.json({ status: 'fail', data: null })
    }
  }
)

// PUT - 更新會員資料(密碼更新用)
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  // user為來自前端的會員資料(準備要修改的資料)
  const userPassword = req.body

  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)，從前端接收的資料為
  // {
  //   originPassword: '', // 原本密碼，要比對成功才能修改
  //   newPassword: '', // 新密碼
  // }
  if (!id || !userPassword.origin || !userPassword.new) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 查詢資料庫目前的資料
  const dbUser = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // null代表不存在
  if (!dbUser) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(userPassword.origin, dbUser.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // 對資料庫執行update
  const [affectedRows] = await User.update(
    { password: userPassword.new },
    {
      where: {
        id,
      },
      individualHooks: true, // 更新時要加密密碼字串 trigger the beforeUpdate hook
    }
  )

  // 沒有更新到任何資料 -> 失敗
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗' })
  }

  // 成功，不帶資料
  return res.json({ status: 'success', data: null })
})

// PUT - 更新會員資料(排除更新密碼)
router.put('/:id/profile', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  // user為來自前端的會員資料(準備要修改的資料)
  const user = req.body

  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)
  if (!id || !user.name) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 查詢資料庫目前的資料
  const dbUser = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // null代表不存在
  if (!dbUser) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // 有些特殊欄位的值沒有時要略過更新，不然會造成資料庫錯誤
  if (!user.birth_date) {
    delete user.birth_date
  }

  // 對資料庫執行update
  const [affectedRows] = await User.update(user, {
    where: {
      id,
    },
  })

  // 沒有更新到任何資料 -> 失敗或沒有資料被更新
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
  }

  // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
  const updatedUser = await User.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  // password資料不需要回應給瀏覽器
  delete updatedUser.password
  //console.log(updatedUser)
  // 回傳
  return res.json({ status: 'success', data: { user: updatedUser } })
})

// DELETE - 刪除會員資料
router.delete('/:id', async function (req, res) {
  const id = getIdParam(req)

  const affectedRows = await User.destroy({
    where: {
      id,
    },
  })

  // 沒有刪除到任何資料 -> 失敗或沒有資料被刪除
  if (!affectedRows) {
    return res.json({
      status: 'fail',
      message: 'Unable to detele.',
    })
  }

  // 成功
  return res.json({ status: 'success', data: null })
})

export default router
