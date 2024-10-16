// !! 注意: 此檔案不是express執行時用，只用於備份資料庫，指令為`npm run db-backup`，備份至`db-backups`目錄中
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
import { extendLog } from '#utils/tool.js'
import 'colors'
extendLog()

// 讀取.env檔用
import 'dotenv/config.js'

// 備份資料夾
const folder = './db-backups'
// 相關資料庫設定
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

// 備份出的檔案名稱
const date = new Date()
const dumpFileName = `${date.getFullYear()}${
  date.getMonth() + 1
}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.dump.sql`

const filePath = path.join(process.cwd(), `${folder}/` + dumpFileName)

// 執行備份指令
const writeStream = fs.createWriteStream(filePath)
const dump = spawn('mysqldump', [
  '-h',
  config.host,
  '-P',
  config.port,
  '-u',
  config.user,
  `-p${config.password}`,
  config.database,
])

// 輸出訊息
dump.stdout
  .pipe(writeStream)
  .on('finish', function () {
    console.log(
      `INFO - 資料庫"${config.database}"已備份完成，檔名為"${dumpFileName}". database backup completed.`
        .bgGreen
    )
  })
  .on('error', function (err) {
    console.log(
      `ERROR - 資料庫${config.database}備份失敗 database backup failed.`.bgRed
    )
    console.log(err)
  })
