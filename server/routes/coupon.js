import express from 'express'
import db from '#configs/mysql.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// 驗證 JWT token 的中間件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: '未提供認證token' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '無效的token' })
    }
    req.user = user
    next()
  })
}

// 獲取所有優惠券
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupon')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' })
  }
})

// 獲取當前登入用戶的優惠券
router.get('/my-coupons', authenticateToken, async (req, res) => {
  try {
    // 從 JWT token 中獲取用戶 ID
    const userId = req.user.id

    const [rows] = await db.query(
      `SELECT uc.*, c.id as coupon_id, c.name, c.discount_rate, c.type, c.minimumSpend, c.maximumDiscount,
              c.start_date, c.end_date, c.shop_id, c.permenent, c.activation, c.status, c.termsAndConditions, c.createdAt, c.updatedAt  
        FROM users_coupon uc  
        JOIN coupon c ON uc.coupon_id = c.id  
        JOIN users u ON uc.user_id = u.id  
        WHERE uc.user_id = ?
        AND uc.user_collected = 1`,
      [userId]
    )

    res.json(rows)
  } catch (error) {
    console.error('Error fetching user coupons:', error)
    res.status(500).json({ error: '獲取用戶優惠券失敗' })
  }
})

// 獲取所有用戶優惠券
router.get('/user-coupons', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT uc.*, c.coupon_name, c.discount, c.expire_date, u.username ' +
        'FROM user_coupon uc ' +
        'JOIN coupon c ON uc.coupon_id = c.id ' +
        'JOIN users u ON uc.user_id = u.id'
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: '獲取用戶優惠券失敗' })
  }
})

// 用戶取得優惠券的路由
router.post('/get-coupon', async (req, res) => {
  try {
    const { userId, cpId } = req.body
    console.log(userId, cpId)

    // 參數驗證
    if (!userId || !cpId) {
      return res.status(400).json({ error: '缺少必要參數' })
    }

    const [rows] = await db.query(
      'UPDATE users_coupon SET user_collected=1 WHERE coupon_id = ? AND user_id = ?',
      [cpId, userId]
    )

    // 檢查是否有更新任何記錄
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: '未找到符合條件的優惠券' })
    }

    res.json({
      success: true,
      message: '優惠券領取成功',
      data: rows,
    })
  } catch (error) {
    console.error('Error in get-coupon:', error)
    res.status(500).json({
      error: '獲取用戶優惠券失敗',
      message: error.message,
    })
  }
})

export default router
