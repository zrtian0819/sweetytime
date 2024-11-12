import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

import authenticate from '#middlewares/authenticate.js'
import sequelize from '#configs/db.js'
import { where } from 'sequelize'
const { user_like } = sequelize.models

// 獲得某會員id的有加入到我的最愛清單中的商品id們
// 此路由只有登入會員能使用
router.get('/:type', authenticate, async (req, res) => {
  const { type } = req.params
  const user_id = req.user.id

  const item_ids = await user_like.findAll({
    attributes: ['item_id'],
    where: {
      user_id,
      type,
    },
    raw: true, //只需要資料
  })
  const favorites = item_ids.map((v) => v.item_id)

  if (favorites.length === 0) {
    return res.json({
      status: 'success',
      message: '目前沒有收藏項目',
      data: [],
    })
  } else {
    return res.json({ status: 'success', data: { favorites } })
  }
})

router.put('/:type/:id', authenticate, async (req, res, next) => {
  const item_id = getIdParam(req)
  const user_id = req.user.id
  const { type } = req.params

  const existFav = await user_like.findOne({ where: { item_id, user_id } })
  if (existFav) {
    return res.json({ status: 'error', message: '資料已經存在，新增失敗' })
  }

  const newFav = await user_like.create({ item_id, user_id, type })

  // console.log(newFav.id)

  // 沒有新增到資料
  if (!newFav.id) {
    return res.json({
      status: 'error',
      message: '新增失敗',
    })
  }

  return res.json({
    status: 'success',
    message: '收藏已新增',
    data: { item_id, type },
  })
})

router.delete('/:type/:id', authenticate, async (req, res, next) => {
  const item_id = getIdParam(req)
  const user_id = req.user.id
  const { type } = req.params

  const affectedRows = await user_like.destroy({
    where: {
      item_id,
      user_id,
      type,
    },
  })

  // 沒有刪除到任何資料 -> 失敗或沒有資料被刪除
  if (!affectedRows) {
    return res.json({
      status: 'error',
      message: '刪除失敗',
    })
  }

  // 成功
  return res.json({
    status: 'success',
    message: '收藏已刪除',
    data: { item_id, type },
  })
})

export default router
