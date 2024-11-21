import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

// 獲取所有使用者
router.get('/users', async (req, res) => {
  try {
    const [rows] =
      await db.query(`SELECT COUNT(CASE WHEN role = 'user' THEN id END) as NumUser,
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
    const [rows] = await db.query(
      `SELECT COUNT(id) as NumBlacklist FROM users WHERE activation = 0`
    )
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

// 獲取30天內最熱門熱賣商品
router.get('/top5-products', async (req, res) => {
  try {
    const [rows] = await db.execute(`
WITH processed_names AS (
    SELECT 
        -- 如果名稱中包含 '/'，只取第一個 '/' 之前的文字
        -- 如果沒有 '/'，則返回完整名稱
        CASE 
            WHEN p.name LIKE '%/%' THEN SUBSTRING_INDEX(p.name, '/', 1)
            ELSE p.name
        END AS processed_name,
        p.id
    FROM product p
      )

      SELECT 
          pn.processed_name as name,
          SUM(oi.amount) as amount
      FROM orders_items oi
      LEFT JOIN processed_names pn ON pn.id = oi.product_id
      GROUP BY pn.processed_name
      ORDER BY amount DESC
      LIMIT 5;
    `)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hot products' })
  }
})

// 獲得30天內最熱門店家
router.get('/top5-shops', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.name, SUM(o.total_price) as price
      FROM shop s
      LEFT JOIN orders o ON o.shop_id = s.id
      WHERE o.order_time BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) 
          AND CURRENT_DATE()
      GROUP BY s.name
      ORDER BY price DESC
      LIMIT 5;
    `)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hot shops' })
  }
})

export default router
