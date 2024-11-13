import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'
const { Product } = sequelize.models
import { QueryTypes, Op } from 'sequelize'

/* 
測試連結:
/products?page=3&perpage=10&brand_ids=1,2,4&cat_ids=4,5,6,10,11,12&color_ids=1,2&size_ids=2,3&tag_ids=1,2,4&name_like=e&price_gte=1500&price_lte=10000&sort=price&order=asc
*/
// GET 獲得所有資料，加入分頁與搜尋字串功能，單一資料表處理
router.get('/', async (req, res) => {
  // 獲取query參數值
  // const {
  //   page = 1, // number,  用於 OFFSET =  (Number(page) - 1) * Number(perpage),
  //   perpage = 10, // number, 用於 LIMIT
  //   name_like = '', // string, 對應 name 欄位, `name LIKE '%name_like%'`
  //   brand_ids = '', // string, 對應 brand_id 欄位,  `brand_id IN (brand_ids)`
  //   cat_ids = '', // string, 對應 cat_id 欄位,  `cat_id IN (cat_ids)`
  //   color_ids = '', // string, 對應 color 欄位,  `CONCAT(",", color, ",") REGEXP ",(1|2),"`
  //   tag_ids = '', // string, 對應 tag 欄位,
  //   size_ids = '', // string, 對應 size 欄位,
  //   sort='price' // string, 排序欄位 用於 ORDER BY
  //   order='asc' // string, 排序順序 用於 ORDER BY 'asc' | 'desc', 預設為'asc'
  //   price_gte = 1500 // number, 對應 price 欄位, `price >= 1500`
  //   price_lte = 100000 // number, 對應 price 欄位, `price <= 10000`
  //   raw=true, //boolean, 代表只回傳products陣列
  // } = req.query

  // !!注意: 以下都要檢查各query參數值的正確性，或給定預設值，要不然可能會產生資料庫查詢錯誤
  // 建立例如: `CONCAT(",", color, ",") REGEXP ",(1|2),"`
  const genConcatRegexp = (param, column) => {
    return sequelize.where(
      sequelize.fn('CONCAT', ',', sequelize.col(column), ','),
      {
        [Op.regexp]: `,(${param.split(',').join('|')}),`,
      }
    )
  }

  // 建立各where條件從句用
  const genClause = (key, value) => {
    switch (key) {
      case 'name_like':
        return {
          name: {
            [Op.like]: `%${value}%`,
          },
        }
      case 'brand_ids':
        return {
          brand_id: value.split(',').map((v) => Number(v)),
        }
      case 'cat_ids':
        return {
          cat_id: value.split(',').map((v) => Number(v)),
        }
      case 'color_ids':
        return genConcatRegexp(value, 'color')
      case 'size_ids':
        return genConcatRegexp(value, 'size')
      case 'tag_ids':
        return genConcatRegexp(value, 'tag')
      case 'price_gte':
        // 會有'0'字串的情況，注意要跳過此條件
        if (!Number(value)) return ''

        return {
          price: {
            [Op.gte]: Number(value),
          },
        }
      case 'price_lte':
        // 會有'0'字串的情況，注意要跳過此條件
        if (!Number(value)) return ''

        return {
          price: {
            [Op.lte]: Number(value),
          },
        }
      default:
        return ''
    }
  }

  // where各條件(以AND相連)
  const conditions = []
  for (const [key, value] of Object.entries(req.query)) {
    if (value) {
      conditions.push(genClause(key, value))
    }
  }

  // console.log(conditions)

  // 分頁用
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 10
  const offset = (page - 1) * perpage
  const limit = perpage

  // 排序用
  const orderDirection = req.query.order || 'ASC'
  const order = req.query.sort
    ? [[req.query.sort, orderDirection]]
    : [['id', 'ASC']]

  // 避免sql查詢錯誤導致後端當掉，使用try/catch語句
  try {
    const { count, rows } = await Product.findAndCountAll({
      where: { [Op.and]: conditions },
      raw: true, // 只需要資料表中資料,
      // logging: (msg) => console.log(msg.bgWhite),
      offset,
      limit,
      order,
    })

    if (req.query.raw === 'true') {
      return res.json(rows)
    }

    // 計算總頁數
    const pageCount = Math.ceil(count / Number(perpage)) || 0

    return res.json({
      status: 'success',
      data: {
        total: count,
        pageCount,
        page,
        perpage,
        products: rows,
      },
    })
  } catch (e) {
    console.log(e)

    return res.json({
      status: 'error',
      message: '無法查詢到資料，查詢字串可能有誤',
    })
  }
})

// 獲得所有資料，加入分頁與搜尋字串功能，單一資料表處理
// products/qs?page=1&keyword=Ele&brand_ids=1&cat_ids=4,5,6,7,8&sizes=1,2&tags=3,4&colors=1,2&orderby=id,asc&perpage=10&price_range=1500,10000
// router.get('/qs', async (req, res, next) => {
//   // 獲取網頁的搜尋字串
//   const {
//     page,
//     keyword,
//     brand_ids,
//     cat_ids,
//     colors,
//     tags,
//     sizes,
//     orderby,
//     perpage,
//     price_range,
//   } = req.query

//   // TODO: 這裡可以檢查各query string正確性或給預設值，檢查不足可能會產生查詢錯誤

//   // 建立資料庫搜尋條件
//   const conditions = []

//   // 關鍵字，keyword 使用 `name LIKE '%keyword%'`
//   conditions[0] = keyword ? `name LIKE '%${keyword}%'` : ''

//   // 品牌，brand_ids 使用 `brand_id IN (4,5,6,7)`
//   conditions[1] = brand_ids ? `brand_id IN (${brand_ids})` : ''

//   // 分類，cat_ids 使用 `cat_id IN (1, 2, 3, 4, 5)`
//   conditions[2] = cat_ids ? `cat_id IN (${cat_ids})` : ''

//   // 顏色: FIND_IN_SET(1, color) OR FIND_IN_SET(2, color)
//   conditions[3] = getFindInSet(colors, 'color')

//   // 標籤: FIND_IN_SET(3, tag) OR FIND_IN_SET(2, tag)
//   conditions[4] = getFindInSet(tags, 'tag')

//   // 尺寸: FIND_IN_SET(3, size) OR FIND_IN_SET(2, size)
//   conditions[5] = getFindInSet(sizes, 'size')

//   // 價格
//   conditions[6] = getBetween(price_range, 'price', 1500, 10000)

//   // 各條件為AND相接(不存在時不加入where從句中)
//   const where = getWhere(conditions, 'AND')

//   // 排序用，預設使用id, asc
//   const order = getOrder(orderby)

//   // 分頁用
//   // page預設為1，perpage預設為10
//   const perpageNow = Number(perpage) || 10
//   const pageNow = Number(page) || 1
//   const limit = perpageNow
//   // page=1 offset=0; page=2 offset= perpage * 1; ...
//   const offset = (pageNow - 1) * perpageNow

//   const sqlProducts = `SELECT * FROM product ${where} ${order} LIMIT ${limit} OFFSET ${offset}`
//   const sqlCount = `SELECT COUNT(*) AS count FROM product ${where}`

//   console.log(sqlProducts.bgWhite)

//   const products = await sequelize.query(sqlProducts, {
//     type: QueryTypes.SELECT, //執行為SELECT
//     raw: true, // 只需要資料表中資料
//   })

//   const data = await sequelize.query(sqlCount, {
//     type: QueryTypes.SELECT, //執行為SELECT
//     raw: true, // 只需要資料表中資料
//     plain: true, // 只需一筆資料
//   })

//   // 查詢
//   // const total = await countWithQS(where)
//   // const products = await getProductsWithQS(where, order, limit, offset)

//   // json回傳範例
//   //
//   // {
//   //   total: 100,
//   //   perpage: 10,
//   //   page: 1,
//   //   data:[
//   //     {id:123, name:'',...},
//   //     {id:123, name:'',...}
//   //   ]
//   // }

//   const result = {
//     total: data.count,
//     perpage: Number(perpage),
//     page: Number(page),
//     data: products,
//   }

//   res.json(result)
// })

// 獲得單筆資料
router.get('/:id', async (req, res, next) => {
  // 轉為數字
  const id = getIdParam(req)

  // 只會回傳單筆資料
  const product = await Product.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  return res.json({ status: 'success', data: { product } })
})

// 獲得所有資料(測試用，不適合資料太多使用)
// router.get('/', async (req, res, next) => {
//   const products = await Product.findAll({ raw: true })
//   res.json({ status: 'success', data: { products } })
// })

export default router
