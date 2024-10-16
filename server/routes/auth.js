import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 資料庫使用
import { QueryTypes } from 'sequelize'
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 驗証加密密碼字串用
import { compareHash } from '#db-helpers/password-hash.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// 檢查登入狀態用
router.get('/check', authenticate, async (req, res) => {
  // 查詢資料庫目前的資料
  const user = await User.findByPk(req.user.id, {
    raw: true, // 只需要資料表中資料
  })

  // 不回傳密碼值
  delete user.password
  return res.json({ status: 'success', data: { user } })
})

router.post('/login', async (req, res) => {
  // 從前端來的資料 req.body = { username:'xxxx', password :'xxxx'}
  const loginUser = req.body

  // 檢查從前端來的資料哪些為必要
  if (!loginUser.username || !loginUser.password) {
    return res.json({ status: 'fail', data: null })
  }

  // 查詢資料庫，是否有這帳號與密碼的使用者資料
  // 方式一: 使用直接查詢
  // const user = await sequelize.query(
  //   'SELECT * FROM user WHERE username=? LIMIT 1',
  //   {
  //     replacements: [loginUser.username], //代入問號值
  //     type: QueryTypes.SELECT, //執行為SELECT
  //     plain: true, // 只回傳第一筆資料
  //     raw: true, // 只需要資料表中資料
  //     logging: console.log, // SQL執行呈現在console.log
  //   }
  // )

  // 方式二: 使用模型查詢
  const user = await User.findOne({
    where: {
      username: loginUser.username,
    },
    raw: true, // 只需要資料表中資料
  })

  // console.log(user)

  // user=null代表不存在
  if (!user) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(loginUser.password, user.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  const returnUser = {
    id: user.id,
    username: user.username,
    google_uid: user.google_uid,
    line_uid: user.line_uid,
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  res.json({
    status: 'success',
    data: { accessToken },
  })
})

router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

export default router
