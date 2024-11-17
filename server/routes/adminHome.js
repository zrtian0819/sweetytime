import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

// 獲取所有使用者
router.get('/users', async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT COUNT(CASE WHEN role = 'user' THEN id END) as NumUser,
                                            COUNT(CASE WHEN role = 'shop' THEN id END) as NumShop,
                                            COUNT(CASE WHEN role = 'admin' THEN id END) as NumAdmin
                                     FROM users`)
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  })

// 獲取黑名單(activation=0)人數
router.get('/blacklist', async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT COUNT(id) as NumBlacklist FROM users WHERE activation = 0`)
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blacklist' })
    }
  })

// 獲取每日營業額
router.get('/revenue', async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * 
                                     FROM (SELECT DATE_FORMAT(o.order_time, '%m/%d') as order_date,
                                                  SUM(o.total_price) as revenue
                                           FROM orders o
                                           WHERE o.status in ('已完成','運送中')
                                           GROUP BY DATE_FORMAT(o.order_time, '%m/%d')
                                           ORDER BY order_date DESC
                                           LIMIT 7
                                       ) sub
                                       ORDER BY order_date;`)
// 這個是只讀最近7天的營業額
// WITH RECURSIVE dates AS (
// SELECT CURDATE() as date
// UNION ALL
// SELECT DATE_SUB(date, INTERVAL 1 DAY)
// FROM dates
// WHERE date > DATE_SUB(CURDATE(), INTERVAL 6 DAY)
// )
// SELECT 
// DATE_FORMAT(d.date, '%m-%d') as order_date,
// COALESCE(SUM(o.total_price), 0) as revenue
// FROM dates d
// LEFT JOIN orders o ON DATE(o.order_time) = d.date
// AND o.status in ('已完成','運送中')
// GROUP BY d.date
// ORDER BY d.date DESC;
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch revenue' })
    }
  })



  export default router