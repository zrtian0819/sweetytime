import * as fs from 'fs'
import path from 'path'
// 取得專案根目錄
import appRootPath from 'app-root-path'

// 修正 __dirname for esm, windows dynamic import bug
import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function applyModels(sequelize) {
  // 載入models中的各檔案
  const modelsPath = path.join(appRootPath.path, 'models')
  const filenames = await fs.promises.readdir(modelsPath)

  for (const filename of filenames) {
    const item = await import(pathToFileURL(path.join(modelsPath, filename)))
    item.default(sequelize)
  }
}
