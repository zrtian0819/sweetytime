import express from 'express'
const router = express.Router()

import sequelize from '#configs/db.js'
const { User } = sequelize.models

import jsonwebtoken from 'jsonwebtoken'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.post('/', async function (req, res, next) {
  // providerData =  req.body
  console.log(JSON.stringify(req.body))

  // 檢查從react來的資料
  if (!req.body.providerId || !req.body.uid) {
    return res.json({ status: 'error', message: '缺少google登入資料' })
  }

  const { displayName, email, uid, photoURL } = req.body
  const google_uid = uid

  // 以下流程:
  // 1. 先查詢資料庫是否有同google_uid的資料
  // 2-1. 有存在 -> 執行登入工作
  // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作

  // 1. 先查詢資料庫是否有同google_uid的資料
  const total = await User.count({
    where: {
      google_uid,
    },
  })

  // 要加到access token中回傳給前端的資料
  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  let returnUser = {
    id: 0,
    username: '',
    google_uid: '',
    line_uid: '',
  }

  if (total) {
    // 2-1. 有存在 -> 從資料庫查詢會員資料
    const dbUser = await User.findOne({
      where: {
        google_uid,
      },
      raw: true, // 只需要資料表中資料
    })

    // 回傳給前端的資料
    returnUser = {
      id: dbUser.id,
      username: dbUser.username,
      google_uid: dbUser.google_uid,
      line_uid: dbUser.line_uid,
    }
  } else {
    // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作
    const user = {
      name: displayName,
      email: email,
      google_uid,
      photo_url: photoURL,
    }

    // 新增會員資料
    const newUser = await User.create(user)

    // 回傳給前端的資料
    returnUser = {
      id: newUser.id,
      username: '',
      google_uid: newUser.google_uid,
      line_uid: newUser.line_uid,
    }
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: {
      accessToken,
    },
  })
})

export default router
