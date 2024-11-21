import express from 'express'
import db from '#configs/mysql.js'
import authenticate from '#middlewares/authenticate.js'
import { createLinePayClient } from 'line-pay-merchant'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config.js'

const router = express.Router()

// 初始化 Line Pay 客戶端
const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})

// 將購物車內容轉換為訂單資料
const createOrdersFromCart = (cartData) => {
  return cartData.map((shopCart) => {
    const orderId = uuidv4()

    // 計算訂單金額
    const totalAmount = shopCart.afterDiscount
      ? shopCart.afterDiscount + shopCart.ship_pay
      : shopCart.shopTotal + shopCart.ship_pay

    // Line Pay 訂單資訊
    const orderInfo = {
      orderId,
      currency: 'TWD',
      amount: totalAmount,
      packages: [
        {
          id: uuidv4(),
          amount: totalAmount,
          products: shopCart.cart_content.map((item) => ({
            id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      ],
      options: { display: { locale: 'zh_TW' } },
    }

    // 資料庫訂單資料
    const dbOrder = {
      order_id: orderId,
      status: 'pending',
      user_id: shopCart.user_id,
      shop_id: shopCart.shop_id,
      coupon_id: shopCart.coupon_id,
      payment: shopCart.payment,
      delivery: shopCart.way,
      delivery_address: shopCart.address,
      delivery_name: shopCart.name,
      delivery_phone: shopCart.phone,
      note: shopCart.note,
      order_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      total_price: totalAmount,
      ship_pay: shopCart.ship_pay,
    }

    // 訂單項目資料
    const orderItems = shopCart.cart_content.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      amount: item.quantity,
      that_time_price: item.price,
    }))

    return {
      orderInfo,
      dbOrder,
      orderItems,
    }
  })
}

// API 處理函數
const apiHandlers = {
  // 建立訂單
  async createOrder(req, res) {
    try {
      const orders = createOrdersFromCart(req.body)
      let totalAmount = 0
      const orderIds = []

      // 開始交易
      await db.query('START TRANSACTION')

      for (const order of orders) {
        // 插入訂單資料
        await db.query(`INSERT INTO orders SET ?`, [order.dbOrder])

        // 插入訂單項目
        for (const item of order.orderItems) {
          await db.query(`INSERT INTO orders_items SET ?`, [item])

          // 更新商品庫存
          await db.query(
            `UPDATE products 
             SET stocks = stocks - ? 
             WHERE id = ?`,
            [item.amount, item.product_id]
          )
        }

        orderIds.push(order.dbOrder.order_id)
        totalAmount += order.dbOrder.total_price
      }

      await db.query('COMMIT')

      // 建立彙總的 Line Pay 訂單
      const consolidatedOrder = {
        orderId: uuidv4(),
        currency: 'TWD',
        amount: totalAmount,
        packages: orders.map((order) => ({
          id: order.dbOrder.order_id,
          amount: order.dbOrder.total_price,
          products: order.orderItems.map((item) => ({
            id: item.product_id,
            quantity: item.amount,
            price: item.that_time_price,
          })),
        })),
        options: { display: { locale: 'zh_TW' } },
      }

      res.json({
        status: 'success',
        data: {
          orderIds,
          totalAmount,
          consolidatedOrder,
        },
      })
    } catch (error) {
      await db.query('ROLLBACK')
      res.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  },

  // LINE Pay 請求處理
  async reserve(req, res) {
    try {
      const { orderIds } = req.query

      if (!orderIds) {
        return res.status(400).json({
          status: 'error',
          message: '訂單編號不存在',
        })
      }

      // 查詢所有訂單資料
      const [orders] = await db.query(
        `SELECT o.*, 
                oi.product_id, oi.amount, oi.that_time_price,
                p.name as product_name
         FROM orders o
         JOIN orders_items oi ON o.order_id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.order_id IN (?)`,
        [orderIds.split(',')]
      )

      if (!orders.length) {
        return res.status(404).json({
          status: 'error',
          message: '訂單不存在',
        })
      }

      // 計算總金額
      const totalAmount = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_price),
        0
      )

      // 建立 LINE Pay 請求
      const response = await linePayClient.request.send({
        body: {
          orderId: uuidv4(),
          currency: 'TWD',
          amount: totalAmount,
          packages: orders.map((order) => ({
            id: order.order_id,
            amount: parseFloat(order.total_price),
            products: [
              {
                id: order.product_id,
                name: order.product_name,
                quantity: order.amount,
                price: order.that_time_price,
              },
            ],
          })),
          redirectUrls: {
            confirmUrl: `${process.env.REACT_REDIRECT_CONFIRM_URL}?orderIds=${orderIds}`,
            cancelUrl: `${process.env.REACT_REDIRECT_CANCEL_URL}?orderIds=${orderIds}`,
          },
        },
      })

      // 更新所有訂單狀態
      await db.query(
        `UPDATE orders 
         SET status = 'processing' 
         WHERE order_id IN (?)`,
        [orderIds.split(',')]
      )

      res.redirect(response.body.info.paymentUrl.web)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  },
}

// 路由設定
router.post('/create-order', authenticate, apiHandlers.createOrder)
router.get('/reserve', apiHandlers.reserve)

export default router
