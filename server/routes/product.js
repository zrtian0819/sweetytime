import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

// 商品列表頁隨機取商品(加ORDER BY RAND())
// router.get('/', async (req, res) => {
//   try {
//     const [rows] = await db.query(`
// SELECT p.*,
//   (SELECT file_name
//     FROM product_photo
//     WHERE product_photo.product_id = p.id
//     ORDER BY id ASC LIMIT 1) AS file_name
// FROM product p
// `)
//     res.json(rows)
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch product' })
//   }
// })

router.get('/', async (req, res) => {
  try {
    console.log('Received query:', req.query) // 檢查收到的參數
    const {
      class: classId,
      isOnSale,
      order,
      priceRange,
      search,
      shopId,
    } = req.query

    let query = `
      SELECT p.*, 
        (SELECT file_name 
          FROM product_photo 
          WHERE product_photo.product_id = p.id 
          ORDER BY id ASC LIMIT 1) AS file_name
      FROM product p
    `

    const conditions = [] // 存放篩選條件的SQL語句
    const values = [] // 存放篩選條件的參數

    if (classId != '' && classId != null) {
      // 商品類別
      conditions.push(`p.product_class_id = ?`)
      values.push(parseInt(classId))
    }

    if (Array.isArray(priceRange) && priceRange.length === 2) {
      // 價格區間
      const priceMin = parseInt(priceRange[0])
      const priceMax = parseInt(priceRange[1])

      if (priceMin != null) {
        conditions.push(`p.price >= ?`)
        values.push(priceMin)
      }

      if (priceMax != null) {
        conditions.push(`p.price <= ?`)
        values.push(priceMax)
      }
    }

    if (shopId != null) {
      // 商家
      conditions.push(`p.shop_Id = ?`)
      values.push(parseInt(shopId))
    }

    if (search != '') {
      // 商家
      const searchPattern = `%${search}%`
      conditions.push(`(p.name LIKE ? OR p.keywords LIKE ?)`)
      values.push(searchPattern, searchPattern)
    }

    if (isOnSale === 'true') {
      // 優惠
      conditions.push(`p.discount != 1`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // 排序
    if (order === 'priceDecrease') {
      query += ' ORDER BY p.price DESC'
    } else if (order === 'priceIncrease') {
      query += ' ORDER BY p.price ASC'
    } else {
      query += ' ORDER BY RAND()' // 預設隨機排序
    }

    console.log('query', query)

    const [rows] = await db.query(query, values) // 將 values 作為參數傳遞
    res.json(rows)
  } catch (error) {
    console.error('Error processing request:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 商品細節
router.get('/details', async (req, res) => {
  const id = parseInt(req.query.id)
  try {
    // 查詢產品基本資料
    const [productRows] = await db.query('SELECT * FROM product WHERE id = ?', [
      id,
    ])
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product = productRows[0]

    // 查詢產品照片
    const [photoRows] = await db.query(
      'SELECT file_name FROM product_photo WHERE product_id = ? ORDER BY id ASC',
      [id]
    )

    // 查商品類別名稱
    const [product_class] = await db.query(
      'SELECT class_name FROM product_class WHERE id =?',
      [product.product_class_id]
    )

    // 查商家名稱
    const [product_shop_name] = await db.query(
      'SELECT name FROM shop WHERE id =?',
      [product.shop_id]
    )

    res.json({
      product,
      product_class,
      product_shop_name,
      photos: photoRows.map((row) => row.file_name),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' })
  }
})

// 猜你喜歡十個商品
router.get('/guessYouLike', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, 
        (SELECT file_name 
          FROM product_photo 
          WHERE product_photo.product_id = p.id 
          ORDER BY id ASC LIMIT 1) AS file_name
      FROM product p ORDER BY RAND() LIMIT 10
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 細節頁推薦課程
router.get('/featureLessons', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM lesson ORDER BY RAND() LIMIT 5
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 後台Admin按順序取商品
router.get('/admin', async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT p.*, 
  (SELECT file_name 
    FROM product_photo 
    WHERE product_photo.product_id = p.id 
    ORDER BY id ASC LIMIT 1) AS file_name,
  (SELECT class_name 
    FROM product_class 
    WHERE product_class.id = p.product_class_id ) AS class_name,
  (SELECT name 
    FROM shop 
    WHERE shop.id = p.shop_id ) AS shop_name
FROM product p
`)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 後台商家取自家商品
router.get('/shop', async (req, res) => {
  const sId = parseInt(req.query.sId)
  try {
    const [rows] = await db.query(
      `
SELECT p.*, 
  (SELECT file_name 
    FROM product_photo 
    WHERE product_photo.product_id = p.id 
    ORDER BY id ASC LIMIT 1) AS file_name
FROM product p WHERE shop_id = ?
`,
      [sId]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
export default router
