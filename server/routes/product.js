import express from 'express'
import db from '#configs/mysql.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
const router = express.Router()

// 設定 multer 用於處理檔案上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 定義上傳目錄
    const uploadPath = path.join(
      process.cwd(),
      '../client/public/photos/products'
    )
    // const uploadPath =
    //   'C:/final_project/sweety_time/sweetytime/client/public/photos/testUpload'

    // 檢查並創建目錄
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath) // 設定上傳目錄
  },
  filename: (req, file, cb) => {
    const decodedFileName = decodeURIComponent(file.originalname)
    cb(null, decodedFileName)
  },
})
const upload = multer({ storage })

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

// 商品列表頁，可套用篩選邏輯
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

    // 預設只取 deleted 為 0 的資料
    conditions.push(`p.deleted = 0`)

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
      'SELECT file_name FROM product_photo WHERE is_valid = 1 AND product_id = ? ORDER BY id ASC',
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
      FROM product p WHERE p.deleted = 0 ORDER BY RAND() LIMIT 10
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
      SELECT * FROM lesson WHERE activation = 1 ORDER BY RAND() LIMIT 5
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

// 後台新增照片
router.post('/upload_photos', upload.array('photos'), async (req, res) => {
  try {
    console.log('Received files:', req.files) // 確認是否接收到檔案
    console.log('Received body:', req.body) // 確認是否接收到其他資料

    const productId = req.body.productId // 獲取商品 id
    const fileNames = req.files.map((file) => file.filename) // 取得檔名（不含路徑）

    console.log('fileNames:', fileNames) // 檢視 fileNames

    // 構建插入資料的數據，將 is_valid 設定為 1
    const values = fileNames.map((fileName) => [productId, fileName, 1])

    // 插入資料到資料庫
    const query =
      'INSERT INTO product_photo (product_id, file_name, is_valid) VALUES ?'
    await db.query(query, [values])

    res.status(200).json({ message: '照片上傳並儲存成功', fileNames })
  } catch (error) {
    console.error('Upload Error:', error)
    res.status(500).json({ error: 'Failed to upload photos' })
  }
})

// 後台刪除照片
router.post('/delete_photos', async (req, res) => {
  try {
    const photosToDelete = req.body.photos

    // 構建批量更新查詢
    for (const photo of photosToDelete) {
      await db.query(
        'UPDATE product_photo SET is_valid = 0 WHERE product_id = ? AND file_name = ?',
        [photo.productId, photo.fileName]
      )
    }

    res.status(200).json({ message: '照片刪除成功' })
  } catch (error) {
    console.error('刪除時發生錯誤:', error)
    res.status(500).json({ error: '刪除失敗' })
  }
})
