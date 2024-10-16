// !! 注意: 此檔案並不是express執行時用，指令為`node ./cli/fake-user.js 100`，最後的100數字代表100筆
// eslint-disable-next-line
import { fakerZH_TW as faker } from '@faker-js/faker'
import _ from 'lodash'
import moment from 'moment'
// 讓console.log可以呈現檔案與行號, 呈現顏色用
import { extendLog, writeJsonFile } from '#utils/tool.js'
import 'colors'
extendLog()
// 台灣縣市鄉鎮郵遞區號
import { countries, townships, postcodes } from '#data/tw-township.js'

// 預設產生檔案目錄(相對於根目錄)
const folder = './seeds-tmp/'

// 產生單個物件用
const genUser = () => {
  // 隨機地址用
  let countryIndex = _.random(0, countries.length - 1)
  let townshipIndex = _.random(0, townships[countryIndex].length - 1)

  const postcode = postcodes[countryIndex][townshipIndex]
  const address =
    countries[countryIndex] +
    townships[countryIndex][townshipIndex] +
    faker.location.street() +
    _.random(1, 500) +
    '號' +
    _.random(1, 20) +
    '樓'

  return {
    name: faker.person.fullName(),
    username: faker.internet.userName(),
    password: '11111',
    email: faker.internet.email(),
    sex: faker.person.sex() === 'female' ? '女' : '男',
    birth_date: moment(
      faker.date.birthdate({ min: 15, max: 80, mode: 'age' })
    ).format('YYYY-MM-DD'),
    phone: '09' + faker.helpers.replaceSymbolWithNumber('########'),
    postcode,
    address,
  }
}

// 產生大量資料用
const createUsers = async (num = 1, filename = 'User.json') => {
  const users = Array(num)
    .fill(1)
    .map((v, i) => {
      return genUser()
    })

  await writeJsonFile(filename, users, folder)
  console.log(`INFO - "${num}" 筆範例, "${filename}" 檔案已建立完成`.bgCyan)
}

// 使用指令 `node ./cli/fake-user.js 100`
const args = process.argv
// 預設為10筆
const num = Number(args[2]) || 10
// 建立資料與寫入檔案
await createUsers(num)
// 終止程式
// eslint-disable-next-line
process.exit()
