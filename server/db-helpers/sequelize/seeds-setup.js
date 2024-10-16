import * as fs from 'fs'
import path from 'path'
// 取得專案根目錄
import appRootPath from 'app-root-path'
// 修正 __dirname for esm, windows dynamic import bug
import { fileURLToPath, pathToFileURL } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function applySeeds(sequelize) {
  // 載入各檔案
  const seedsPath = path.join(appRootPath.path, 'seeds')
  const filenames = await fs.promises.readdir(seedsPath)

  for (const filename of filenames) {
    try {
      const data = await fs.promises.readFile(
        pathToFileURL(path.join(seedsPath, filename))
      )
      const seeds = JSON.parse(data)
      const prop = filename.split('.')[0]

      await sequelize.models[prop].bulkCreate(seeds, {
        ignoreDuplicates: true,
        individualHooks: true, // trigger the beforeCreate hook
      })
    } catch (e) {
      // dump error
      console.error(e)
      // out of loop
      break
    }
  }
}
