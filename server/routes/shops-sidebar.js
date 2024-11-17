import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // 查詢 users 資料表中 role="shop" 且 activation=0 的 id
    const [userIdsResult] = await db.query(`
      SELECT id FROM users WHERE role = 'shop' AND activation = 0
    `)

    // 提取 id 為一個陣列
    let userIds = userIdsResult.map((user) => user.id)
    if (userIds.length == 0) {
      userIds.push(-1)
    }

    // 從 shop 資料表中查詢 user_id 不屬於 userIds 的資料
    const [rows] = await db.query(
      `
      SELECT * FROM shop WHERE user_id NOT IN (?)
    `,
      [userIds]
    )

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch shop data' })
  }
})

export default router
