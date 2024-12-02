import * as fs from 'fs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import dotenv from 'dotenv'

// 載入環境變數
dotenv.config()

// 使用檔案的session store，存在sessions資料夾
import sessionFileStore from 'session-file-store'
const FileStore = sessionFileStore(session)

// 修正 ESM 中的 __dirname 與 windows os 中的 ESM dynamic import
import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 讓console.log呈現檔案與行號，與字串訊息呈現顏色用
import { extendLog } from '#utils/tool.js'
import 'colors'
extendLog()

// 建立 Express 應用程式
const app = express()

// cors設定，參數為必要，注意不要只寫`app.use(cors())`
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:9000',
      'https://sweetytime.hkg1.zeabur.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// 視圖引擎設定
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// HTTP 請求記錄器
app.use(logger('dev'))

// 請求體解析器
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

// Cookie 解析器
app.use(cookieParser())

// 靜態檔案服務
app.use(express.static(path.join(__dirname, 'public')))

// Session 設置
const sessionSecret =
  process.env.SESSION_SECRET || '67f71af4602195de2450faeb6f8856c0'
const fileStoreOptions = { logFn: function () {} }

app.use(
  session({
    store: new FileStore(fileStoreOptions),
    name: 'SESSION_ID',
    secret: sessionSecret,
    cookie: {
      maxAge: 30 * 86400000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: false,
  })
)

// 動態路由載入
const apiPath = '/api'
const routePath = path.join(__dirname, 'routes')

try {
  const filenames = await fs.promises.readdir(routePath)

  for (const filename of filenames) {
    const item = await import(pathToFileURL(path.join(routePath, filename)))
    const slug = filename.split('.')[0]
    app.use(`${apiPath}/${slug === 'index' ? '' : slug}`, item.default)
  }
  console.log('API 伺服器運行於 http://localhost:3005/api'.green)
} catch (error) {
  console.error('路由載入錯誤:'.red, error)
}
// 解析 JSON
app.use(express.json())

// 404 錯誤處理
app.use(function (req, res, next) {
  next(createError(404))
})

// 全局錯誤處理
app.use(function (err, req, res, next) {
  console.error(err.stack)

  // 在開發環境提供詳細錯誤信息
  const error =
    req.app.get('env') === 'development'
      ? { message: err.message, stack: err.stack }
      : { message: 'Internal Server Error' }

  res.status(err.status || 500).json({
    success: false,
    error: error,
  })
})

// 未捕獲的 Promise 異常處理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// 未捕獲的異常處理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

export default app
