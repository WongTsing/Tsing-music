module.exports = (date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'M+':date.getMonth() +1,
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds(),
  }
  if(/(y+)/.test(fmt)) {
    fmt.replace(RegExp.$1,date.getFullYear())
  }
  console.log(fmt)
}