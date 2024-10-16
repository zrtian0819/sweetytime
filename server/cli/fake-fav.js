// eslint-disable-next-line
import { fakerZH_TW as faker } from '@faker-js/faker'

// 專用處理sql字串的工具，主要format與escape，防止sql injection
//import sqlString from 'sqlstring'

// 讓console.log可以呈現檔案與行號
import {
  extendLog,
  toKebabCase,
  readJsonFile,
  writeJsonFile,
} from '#utils/tool.js'
extendLog() // 執行全域套用
// console.log呈現顏色用 全域套用
import 'colors'

import _ from 'lodash'

function fakeUser() {
  return {
    name: faker.person.lastName() + faker.person.firstName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '123456',
  }
}

function fakeProduct() {
  const productTypes = [
    '運動鞋',
    '短袖上衣',
    '短褲',
    '長褲',
    '長袖上衣',
    '背心',
  ]
  const name =
    faker.commerce.productName() + faker.string.fromCharacters(productTypes)

  const price = faker.number.int({ min: 15, max: 100 }) * 100

  const img = faker.image.url()

  return {
    name,
    price,
    img,
  }
}

function fakeFavorites(pidRange) {
  const uid = 1

  const pids = []

  for (let i = 0; i < 10; i++) {
    pids.push(faker.number.int({ min: pidRange[0], max: pidRange[1] }))
  }

  const result = _.uniq(pids)

  const favorites = result.map((v, i) => {
    return { id: i + 1, uid, pid: v }
  })

  return favorites
}
