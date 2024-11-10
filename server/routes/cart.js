import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

router.get('/product', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/product/:id', async (req, res) => {
  const pid = req.params.id
  try {
    const [row] = await db.query(`SELECT * FROM product WHERE id=${pid}`)
    res.json(row)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/product_photo/:id', async (req, res) => {
  const pid = req.params.id
  try {
    const [rows] = await db.query(
      `SELECT * FROM product_photo WHERE product_id = ${pid}`
    )
    res.json(rows[0]) //回傳第一張照片
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/shop/:id', async (req, res) => {
  const sid = req.params.id
  try {
    const [rows] = await db.query(`SELECT * FROM shop WHERE id = ${sid}`)
    res.json(rows[0]) //回傳第一筆資料
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/address/:id', async (req, res) => {
  const uid = req.params.id
  try {
    const [rows] = await db.query(
      `SELECT * FROM address WHERE user_id = ${uid}`
    )
    res.json(rows) //回傳第一筆資料
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/delivery', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM delivery`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/user-coupon/:id', async (req, res) => {
  const uid = req.params.id
  try {
    // const [rows] = await db.query(
    //   `SELECT * FROM users_coupon WHERE user_id = ${uid}`
    // )
    const [rows] = await db.query(
      ` SELECT 
          *
        FROM coupon c
        JOIN users_coupon uc ON uc.coupon_id = c.id
        WHERE uc.user_id = ${uid};`
    )
    res.json(rows) //回傳第一筆資料
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.post('/create-order', async (req, res) => {
  try {
    // 只取得需要的數據
    const orderData = req.body
    console.log('收到的訂單數據:', orderData)

    // 處理訂單邏輯
    orderData.forEach(async (shop) => {
      let {
        user_id,
        shop_id,
        coupon_id,
        payment,
        way,
        address,
        name,
        phone,
        note,
        shopTotal,
        afterDiscount,
        cart_content,
      } = shop

      if (!afterDiscount || afterDiscount == '') {
        //沒有被折扣的情況
        afterDiscount = shopTotal
      }

      const [result] = await db.query(
        `INSERT INTO orders (status,user_id,shop_id,coupon_id,payment,delivery,delivery_address,delivery_name,delivery_phone,note,order_time,total_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          '進行中',
          user_id,
          shop_id,
          coupon_id,
          payment,
          way,
          address,
          name,
          phone,
          note,
          getCurrentTime(),
          afterDiscount,
        ]
      )

      console.log(result)
    })

    // 返回處理結果
    res.status(201).json({
      success: true,
      message: '訂單創建成功',
      data: orderData, // 只返回訂單數據
    })
  } catch (error) {
    console.error('訂單創建錯誤:', error)
    res.status(500).json({
      success: false,
      message: '訂單創建失敗',
      error: error.message,
    })
  }
})

export default router

// 取得當前時間的函式
function getCurrentTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // 月份從0開始，需+1
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

console.log(getCurrentTime()) // 輸出: 2024-08-01 08:34:00
