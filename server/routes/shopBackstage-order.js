import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

router.get('/orders/:usersId', async (req, res) => {
  const { usersId } = req.params

  try {
    // 確認該用戶是否為商家並查詢相關商家資料
    const [userShop] = await db.execute(
      `
      SELECT users.*, shop.id AS shop_id, shop.name AS shop_name
      FROM users
      JOIN shop ON users.id = shop.user_id
      WHERE users.id = ? AND users.role = 'shop'
      `,
      [usersId]
    )

    // 驗證商家用戶是否存在
    if (userShop.length === 0) {
      return res.status(404).json({ error: '此商家不存在' })
    }

    const shopId = userShop[0].shop_id

    // 查詢該商家所有的訂單
    const [orders] = await db.execute(
      `
     SELECT 
        o.*, 
        c.name AS coupon_name
      FROM 
        orders AS o
      LEFT JOIN 
        coupon AS c ON o.coupon_id = c.id
      WHERE 
        o.shop_id = ?
      `,
      [shopId]
    )

    // 如果該商家沒有歷史訂單，返回空列表
    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: '此商家目前還沒有歷史訂單', orders: [] })
    }

    // 查詢每筆訂單的商品資料
    const ordersWithItems = await Promise.all(
      orders.map(async (order, index) => {
        const [items] = await db.execute(
          `
          SELECT 
            orders_items.*, 
            pd.id AS product_id, 
            pd.name AS product_name, 
            pd.price, 
            pp.file_name AS product_image
          FROM 
            orders_items 
          JOIN 
            product AS pd ON orders_items.product_id = pd.id
          LEFT JOIN 
            product_photo AS pp ON pd.id = pp.product_id
          WHERE 
            orders_items.order_id = ?
          `,
          [order.id]
        )

        return {
          orderNumber: index + 1, // 自增排序 ID
          ...order,
          items, // 每筆訂單包含的商品資料
        }
      })
    )

    // 返回商家及其訂單資料
    res.json({
      shop: {
        id: shopId,
        name: userShop[0].shop_name,
        owner: userShop[0], // 商家用戶資料
      },
      orders: ordersWithItems, // 該商家所有訂單及其商品
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: '無法獲取訂單資料，請稍後再試' })
  }
})

export default router
