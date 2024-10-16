export const getWhere = (conditions, joinWith = 'AND') => {
  // 去除空字串
  const conditionsValues = conditions.filter((v) => v)

  // 各條件需要先包含在`()`中，因各自內查詢是OR, 與其它的是AND
  return conditionsValues.length > 0
    ? `WHERE ` + conditionsValues.map((v) => `( ${v} )`).join(` ${joinWith} `)
    : ''
}

// 排序用，orderby=id,asc
export const getOrder = (orderby = 'id,asc') => {
  const column = orderby.split(',')[0]
  const keyword = orderby.split(',')[1]

  if (!column || !keyword) return ''

  return `ORDER BY ${column} ${keyword}`
}

// only for mysql
export const getBetween = (value, dbColumn, min, max) => {
  if (!value) return ''

  const ranges = value.split(',')

  const minValue = Number(ranges[0]) // maybe NaN?
  const maxValue = Number(ranges[1]) // maybe NaN?

  if (isNaN(minValue) || isNaN(maxValue)) return ''
  // 價格要介於min~max間
  if (minValue < min || maxValue > max) return ''

  return `${dbColumn} BETWEEN ${minValue} AND ${maxValue}`
}

// only for mysql
// colors=1,2
// FIND_IN_SET(1, color) OR FIND_IN_SET(2, color)
export const getFindInSet = (value, dbColumn, isNumber = true) => {
  if (!value) return ''

  return value
    .split(',')
    .map((v) => `FIND_IN_SET(${isNumber ? Number(v) : v}, ${dbColumn})`)
    .join(' OR ')
}

// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
export const getIdParam = (req) => {
  const id = req.params.id
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10)
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`)
}

// sequelize use
// https://stackoverflow.com/questions/18304504/create-or-update-sequelize
// v6 has upsert: https://sequelize.org/docs/v6/other-topics/upgrade/#modelupsert
export const updateOrCreate = async (model, where, newItem) => {
  // First try to find the record
  const foundItem = await model.findOne({ where })
  if (!foundItem) {
    // Item not found, create a new one
    const item = await model.create(newItem)
    return { item, created: true }
  }
  // Found an item, update it
  const item = await model.update(newItem, { where })
  return { item, created: false }
}
