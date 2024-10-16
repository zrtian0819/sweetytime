import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 導入dotenv 使用 .env 檔案中的設定值 process.env
import dotenv from 'dotenv'

import { readFile, writeFile } from 'fs/promises'

/**
 * Fetching data from the JSON file and parse to JS data
 * @param {string} pathname
 * @returns {Promise<object>} A promise that contains json parse object
 */
export const readJsonFile = async (pathname) => {
  const data = await readFile(path.join(process.cwd(), pathname))
  return JSON.parse(data)
}

export const writeJsonFile = async (pathname, jsonOrObject, folder = './') => {
  try {
    // we need string
    const data =
      typeof jsonOrObject === 'object'
        ? JSON.stringify(jsonOrObject)
        : jsonOrObject

    await writeFile(path.join(process.cwd(), folder + pathname), data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 讓console.log可以呈現檔案與行號
//https://stackoverflow.com/questions/45395369/how-to-get-console-log-line-numbers-shown-in-nodejs
export const extendLog = () => {
  /* eslint-disable */
  ;['log', 'warn', 'error'].forEach((methodName) => {
    const originalMethod = console[methodName]
    console[methodName] = (...args) => {
      try {
        throw new Error()
      } catch (error) {
        originalMethod.apply(console, [
          error.stack // Grabs the stack trace
            .split('\n')[2] // Grabs third line
            .trim() // Removes spaces
            .substring(3) // Removes three first characters ("at ")
            .replace(__dirname, '') // Removes script folder path
            .replace(/\s\(./, ' at ') // Removes first parentheses and replaces it with " at "
            .replace(/\)/, ''), // Removes last parentheses
          '\n',
          ...args,
        ])
      }
    }
  })
  /* eslint-enable  */
}

// 檢查空物件
export const isEmpty = (obj) => {
  /* eslint-disable */
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }
  return JSON.stringify(obj) === JSON.stringify({})
  /* eslint-enable  */
}

// 轉換字串為kebab-case
export const toKebabCase = (str) => {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join('-')
  )
}

// 載入.env檔用
export const loadEnv = (fileExt = '') => {
  dotenv.config({ path: `${fileExt ? '.env' : '.env' + fileExt}` })
}
