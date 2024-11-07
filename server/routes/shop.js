import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

// 獲取所有商家
router.get('/', async (req, res) => {
  try {
    const [shop] = await db.execute(`
      SELECT shop.*, users.activation
      FROM shop
      JOIN users ON shop.user_id = users.id
      WHERE users.role = 'shop'
    `)
    res.json(shop)
  } catch (error) {
    console.error('Error fetching shops:', error)
    res.status(500).json({ error: 'Failed to fetch shops' })
  }
})

// 根據 shopId 獲取特定商家
router.get('/:shopId', async (req, res) => {
  try {
    const [shop] = await db.execute(
      `
      SELECT shop.*, users.activation 
      FROM shop 
      JOIN users ON shop.user_id = users.id
      WHERE users.role = 'shop'
    `
    )
    if (shop.length === 0) {
      return res.status(404).json({ error: '商家不存在' })
    }

    res.json(shop)
  } catch (error) {
    console.error('Error fetching shop:', error)
    res.status(500).json({ error: '無法獲取商家資料' })
  }
})

// 切換商家啟用/停用狀態
router.put('/:shopId', async (req, res) => {
  const { shopId } = req.params

  try {
    // 查詢商家的 user_id
    const [shop] = await db.execute('SELECT user_id FROM shop WHERE id = ?', [
      shopId,
    ])
    if (shop.length === 0) {
      return res.status(404).json({ error: '此商家不存在' })
    }

    const userId = shop[0].user_id

    // 查詢當前的 activation 狀態
    const [user] = await db.execute(
      'SELECT activation FROM users WHERE id = ?',
      [userId]
    )
    if (user.length === 0) {
      return res.status(404).json({ error: '用戶不存在' })
    }

    const currentStatus = user[0].activation
    const newStatus = currentStatus ? 0 : 1

    // 更新 users 表中的 activation 狀態
    await db.execute('UPDATE users SET activation = ? WHERE id = ?', [
      newStatus,
      userId,
    ])

    res.json({ message: `商家狀態已${newStatus ? '啟用' : '停用'}`, newStatus })
  } catch (error) {
    console.error('Error updating shop activation status:', error)
    res.status(500).json({ error: '無法更新商家狀態' })
  }
})

export default router
