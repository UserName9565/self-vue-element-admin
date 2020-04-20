const moment = require('moment')
const agUtile = {
}
// 日期时间格式化,:YYYY-MM-DD HH:mm:ss格式
agUtile.datetimeFormat = function(input) {
  if (!input) {
    return ''
  }
  const a = moment(input).utc(8)
  return a.format('YYYY-MM-DD HH:mm:ss')
}
// 日期格式化,:YYYY-MM-DD格式
agUtile.dateFormat = function(input) {
  if (!input) {
    return ''
  }
  const a = moment(input).utc(8)
  return a.format('YYYY-MM-DD')
}
agUtile.YYMM = function(row, column, cellValue) {
  return agUtile.datetimeFormat(cellValue)
}
export default agUtile
