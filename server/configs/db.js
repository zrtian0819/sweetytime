import { Sequelize } from 'sequelize'

// 讀取.env檔用
import 'dotenv/config.js'

import applyModels from '#db-helpers/sequelize/models-setup.js'

// 資料庫連結資訊
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  }
)
// for postgresql test
// const sequelize = new Sequelize(
//   process.env.PG_DB_DATABASE,
//   process.env.PG_DB_USERNAME,
//   process.env.PG_DB_PASSWORD,
//   {
//     host: process.env.PG_DB_HOST,
//     port: process.env.PG_DB_PORT,
//     dialect: 'postgres',
//     logging: false,
//     define: {
//       freezeTableName: true,
//       charset: 'utf8',
//       collate: 'utf8_general_ci',
//     },
//   }
// )

// 啟動時測試連線
sequelize
  .authenticate()
  .then(() => {
    console.log('INFO - 資料庫已連線 Database connected.'.bgGreen)
  })
  .catch((error) => {
    console.log(
      'ERROR - 無法連線至資料庫 Unable to connect to the database.'.bgRed
    )
    console.error(error)
  })

// 載入models中的各檔案
await applyModels(sequelize)

// 同步化模型與資料庫結構
// 注意，這只會更改資料庫中的表，而不會更改JS端的模型
// 需要更動資料表的範例資料(seeds)，請使用`npm run seed`指令
// sync 的值有以下三種
// { alter: true } 檢查資料庫中資料表的當前狀態(它有哪些列,它們的資料類型等),然後在表中進行必要的更改，使其與模型匹配.
// { force: true } 將建立資料表,如果表已經存在,則將其首先刪除
// {} 如果表不存在,則建立該表(如果已經存在,則不執行任何操作)
await sequelize.sync({})

console.log(
  'INFO - 所有模型已載入完成(如果表不存在建立該表) All models were synchronized successfully.'
    .bgGreen
)

// 輸出模組
export default sequelize
