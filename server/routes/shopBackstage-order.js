import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // 取得所有訂單資料
    const [orders] = await db.execute(`
      SELECT * FROM orders
    `)

    // 使用Promise.all以便同時查詢每筆訂單的訂單項目和優惠券名稱
    const ordersWithItems = await Promise.all(
      orders.map(async (order, index) => {
        // 根據 order_id 查詢訂單項目和產品資料
        const [items] = await db.execute(
          `
          SELECT 
              orders_items.*, 
              pd.id AS product_id, 
              pd.name AS product_name, 
              pd.price, 
              pp.file_name
          FROM 
              orders_items
          JOIN 
              product AS pd
          ON 
              orders_items.product_id = pd.id
          JOIN 
              product_photo AS pp
          ON 
              pd.id = pp.product_id
          WHERE 
              orders_items.order_id = ?
          `,
          [order.id]
        )

        // 如果有 coupon_id，則查詢 coupon 的名稱
        let couponName = null
        if (order.coupon_id) {
          const [coupon] = await db.execute(
            `
            SELECT name FROM coupon WHERE id = ?
            `,
            [order.coupon_id]
          )
          couponName = coupon.length > 0 ? coupon[0].name : null
        }

        // 返回訂單資料，包含自增的排序ID、訂單編號、基本訂單信息、優惠券名稱和訂單項目
        return {
          orderNumber: index + 1, // 自增的排序ID，從1開始
          ...order,
          coupon_name: couponName, // 優惠券名稱
          items,
        }
      })
    )

    res.json(ordersWithItems)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router
