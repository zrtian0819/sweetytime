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
      // 搜尋
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
    const [product_class_name] = await db.query(
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
      product_class_name,
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

// 後台Admin取商品
router.get('/admin', async (req, res) => {
  try {
    console.log('Received query:', req.query) // 檢查收到的參數
    const { search, availability, isDeleted, shopId, order } = req.query

    let query = `
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
`
    const conditions = []
    const values = []

    if (search) {
      const searchPattern = `%${search}%`
      conditions.push(`(p.name LIKE ? OR p.keywords LIKE ?)`)
      values.push(searchPattern, searchPattern)
    }

    if (availability) {
      conditions.push(`p.available =?`)
      values.push(parseInt(availability))
    }

    if (isDeleted) {
      conditions.push(`p.deleted =?`)
      values.push(parseInt(isDeleted))
    }

    if (shopId) {
      conditions.push(`p.shop_id =?`)
      values.push(parseInt(shopId))
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // 排序
    if (order === 'priceDecrease') {
      query += ' ORDER BY p.price DESC'
    } else if (order === 'priceIncrease') {
      query += ' ORDER BY p.price ASC'
    } else if (order === 'Earlier') {
      query += ' ORDER BY p.createdAt ASC'
    } else if (order === 'Later') {
      query += ' ORDER BY p.createdAt DESC'
    } else {
      query += ' ORDER BY id ASC'
    }

    console.log('query', query)

    const [rows] = await db.query(query, values)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 後台上下架
router.post('/toggleAvailable', async (req, res) => {
  const productId = parseInt(req.body.productId) // 從請求中取得 productId
  try {
    // 查詢目前的 available 狀態
    const [rows] = await db.query(
      'SELECT available FROM product WHERE id = ?',
      [productId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // 取得目前的狀態，並計算新狀態
    const currentStatus = rows[0].available
    const newStatus = currentStatus === 1 ? 0 : 1

    // 更新資料庫中的 available 狀態
    await db.query('UPDATE product SET available = ? WHERE id = ?', [
      newStatus,
      productId,
    ])

    // 返回更新後的商品資訊
    const [updatedProduct] = await db.query(
      'SELECT available FROM product WHERE id = ?',
      [productId]
    )

    res.json(updatedProduct[0]) // 將更新後的資料回傳給前端
  } catch (error) {
    console.error('Error toggling available status:', error)
    res.status(500).json({ error: 'Failed to toggle available status' })
  }
})

// 後臺透過userContext的user.id來取得shop id
router.get('/shopId', async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }

  try {
    const [rows] = await db.query('SELECT * FROM shop WHERE user_id = ?', [
      userId,
    ])

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No shop found for the given userId' })
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error('Error fetching shop data:', error.message)
    res.status(500).json({ error: 'Internal server error' })
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

// 後台更新商品資訊
router.post('/update', async (req, res) => {
  console.log(req.body)
  const descriptionText = req.body.description.replace(/<\/?[^>]+(>|$)/g, '') // 移除 HTML 標籤
  console.log(descriptionText)

  try {
    let {
      id,
      name,
      price,
      class: productClass,
      discount,
      available,
      stocks,
      // description,
    } = req.body

    // 將 `price` 和 `discount` 轉為整數
    price = parseInt(price, 10) // 確保是整數
    // discount = parseInt(discount, 10) // 確保是整數

    // 從資料庫中查詢目前的產品資料
    const [existingProduct] = await db.query(
      'SELECT * FROM product WHERE id = ?',
      [id]
    )

    if (!existingProduct) {
      return res.status(404).json({ message: '產品不存在' })
    }

    // 構建更新的欄位和值
    const updates = []
    const updateValues = []

    // 驗證並構建更新
    if (name && name !== existingProduct.name) {
      if (typeof name === 'string' && name.trim().length > 0) {
        updates.push('name = ?')
        updateValues.push(name)
      } else {
        return res.status(400).json({ message: '無效的名稱' })
      }
    }

    if (price !== undefined && price !== existingProduct.price) {
      if (Number.isInteger(price) && price > 0) {
        updates.push('price = ?')
        updateValues.push(price)
      } else {
        return res.status(400).json({ message: '價格必須是正整數' })
      }
    }

    if (productClass && productClass !== existingProduct.class) {
      if (Number.isInteger(productClass) && productClass > 0) {
        updates.push('product_class_id = ?')
        updateValues.push(productClass)
      } else {
        return res.status(400).json({ message: '無效的類別' })
      }
    }

    console.log('復職後的discount:', discount)
    if (discount) {
      // 驗證 discount 是否為有效的折扣值字串
      const discountValue = parseFloat(discount) // 嘗試轉換為浮點數以驗證數值範圍
      if (!isNaN(discountValue)) {
        // console.log('if內的discount:', discount)
        updates.push('discount = ?')
        updateValues.push(discount) // 保留原始字串插入資料庫
      } else {
        return res.status(400).json({ message: '無效的折扣值' })
      }
    }

    if (available !== undefined && available !== existingProduct.available) {
      if (available === 0 || available === 1) {
        updates.push('available = ?')
        updateValues.push(available)
      } else {
        return res.status(400).json({ message: '無效的上架狀態值' })
      }
    }

    if (descriptionText && descriptionText !== existingProduct.description) {
      if (
        typeof descriptionText === 'string' &&
        descriptionText.trim().length > 0
      ) {
        updates.push('description = ?')
        updateValues.push(descriptionText)
      } else {
        return res.status(400).json({ message: '無效的描述' })
      }
    }

    if (stocks) {
      // 嘗試將 stocks 轉換為整數
      const stocksValue = parseInt(stocks, 10)

      // 驗證 stocks 是否為有效的整數
      if (!isNaN(stocksValue) && Number.isInteger(stocksValue)) {
        updates.push('stocks = ?')
        updateValues.push(stocksValue) // 插入轉換後的整數值
      } else {
        return res.status(400).json({ message: '無效的庫存值' })
      }
    }

    // 若沒有需要更新的欄位
    if (updates.length === 0) {
      return res.status(200).json({ message: '無需更新' })
    }

    // 添加 ID 到更新參數
    updateValues.push(id)

    // 更新資料庫
    await db.query(
      `UPDATE product SET ${updates.join(', ')} WHERE id = ?`,
      updateValues
    )

    res.status(200).json({ message: '產品更新成功' })
  } catch (error) {
    console.error('更新時發生錯誤:', error)
    res.status(500).json({ error: '產品更新失敗' })
  }
})

// 後台新增商品資訊
router.post('/create', async (req, res) => {
  console.log(req.body)
  const descriptionText = req.body.description.replace(/<\/?[^>]+(>|$)/g, '') // 移除 HTML 標籤
  console.log(descriptionText)

  try {
    let {
      id,
      name,
      price,
      class: productClass,
      discount,
      available,
      stocks,
      description,
      shopId,
    } = req.body

    // 將 `price` 和 `discount` 轉為整數
    price = parseInt(price, 10) // 確保是整數
    // discount = parseInt(discount, 10) // 確保是整數

    // 構建插入的欄位和值
    const creates = []
    const createsValues = []

    // 加入預設資料
    creates.push('deleted')
    createsValues.push(0)

    creates.push('createdAt')
    createsValues.push(new Date().toISOString())

    // 驗證並構建插入欄位和值
    if (name) {
      if (typeof name === 'string' && name.trim().length > 0) {
        creates.push('name')
        createsValues.push(name)
      } else {
        return res.status(400).json({ message: '無效的名稱' })
      }
    }

    if (price !== undefined) {
      if (Number.isInteger(price) && price > 0) {
        creates.push('price')
        createsValues.push(price)
      } else {
        return res.status(400).json({ message: '價格必須是正整數' })
      }
    }

    if (productClass) {
      if (Number.isInteger(productClass) && productClass > 0) {
        creates.push('product_class_id')
        createsValues.push(productClass)
      } else {
        return res.status(400).json({ message: '無效的類別' })
      }
    }

    console.log('復職後的discount:', discount)
    if (discount) {
      // 驗證 discount 是否為有效的折扣值字串
      const discountValue = parseFloat(discount) // 嘗試轉換為浮點數以驗證數值範圍
      if (!isNaN(discountValue)) {
        // console.log('if內的discount:', discount)
        creates.push('discount')
        createsValues.push(discount) // 保留原始字串插入資料庫
      } else {
        return res.status(400).json({ message: '無效的折扣值' })
      }
    }

    if (stocks) {
      // 嘗試將 stocks 轉換為整數
      const stocksValue = parseInt(stocks, 10)

      // 驗證 stocks 是否為有效的整數
      if (!isNaN(stocksValue) && Number.isInteger(stocksValue)) {
        creates.push('stocks')
        createsValues.push(stocksValue) // 插入轉換後的整數值
      } else {
        return res.status(400).json({ message: '無效的庫存值' })
      }
    }

    if (available !== undefined) {
      if (available === 0 || available === 1) {
        creates.push('available')
        createsValues.push(available)
      } else {
        return res.status(400).json({ message: '無效的上架狀態值' })
      }
    }

    if (descriptionText) {
      if (
        typeof descriptionText === 'string' &&
        descriptionText.trim().length >= 0
      ) {
        creates.push('description')
        createsValues.push(descriptionText)
      } else {
        return res.status(400).json({ message: '無效的描述' })
      }
    }

    if (shopId) {
      if (Number.isInteger(shopId) && shopId > 0) {
        creates.push('shop_id')
        createsValues.push(shopId)
      } else {
        return res.status(400).json({ message: '無效的商家id' })
      }
    }

    // 插入資料庫並獲取自動生成的 ID
    const [result] = await db.query(
      `INSERT INTO product (${creates.join(', ')}) VALUES (${creates.map(() => '?').join(', ')})`,
      createsValues
    )

    // 回傳新增的商品 ID
    res.status(200).json({ message: '商品新增成功', id: result.insertId })
  } catch (error) {
    console.error('新增時發生錯誤:', error)
    res.status(500).json({ error: '商品新增失敗' })
  }
})

// 後台刪除/復原商品
router.post('/toggleDelete', async (req, res) => {
  const productId = req.body.id
  try {
    // 獲取當前的 deleted 值
    const [rows] = await db.query('SELECT deleted FROM product WHERE id = ?', [
      productId,
    ])
    if (rows.length === 0) {
      return res.status(404).json({ error: '商品不存在' })
    }
    const currentDeleted = rows[0].deleted

    // 切換 deleted 值
    const newDeleted = currentDeleted ? 0 : 1

    // 更新 deleted 欄位
    await db.query('UPDATE product SET deleted = ? WHERE id = ?', [
      newDeleted,
      productId,
    ])

    // 根據新的 deleted 值返回相應的訊息
    const message = newDeleted === 1 ? '商品刪除成功' : '商品復原成功'

    res.status(200).json({ message })
  } catch (error) {
    console.error('更新時發生錯誤:', error)
    res.status(500).json({ error: '操作失敗' })
  }
})
