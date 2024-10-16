// !! 注意: 此檔案並不是express執行時用，只用於初始化資料庫資料，指令為`npm run seed`
import sequelize from '#configs/db.js'
import applySeeds from '#db-helpers/sequelize/seeds-setup.js'
// import applyAssociations from './associations-setup.js'

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
import { extendLog } from '#utils/tool.js'
import 'colors'
extendLog()

// 注意，這只會更改資料庫中的表，而不會更改JS端的模型
// sync 的值有以下三種
// { alter: true } 檢查資料庫中資料表的當前狀態(它有哪些列,它們的資料類型等),然後在表中進行必要的更改，使其與模型匹配.
// { force: true } 將建立資料表,如果表已經存在,則將其首先刪除
// {} 如果表不存在,則建立該表(如果已經存在,則不執行任何操作)
// 同步化模型與資料庫結構
await sequelize.sync({ force: true })

// 同步化資料庫範例資料(seeds)
await applySeeds(sequelize)

console.log(
  'INFO - 所有模型與種子資料已完成同步化(建立資料表,如果表已經存在首先刪除) All seeds were synchronized successfully.'
    .bgGreen
)

// 同步化資料庫關聯
// applyAssociations(sequelize)

// Ends the process
// eslint-disable-next-line
process.exit()
