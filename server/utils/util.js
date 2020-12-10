
//时间戳格式化年月日字符串
function timestampToString (timestampStr){
  let year = timestampStr.getFullYear();
  let month = `${(timestampStr.getMonth() + 1 + '').padStart(2, '0')}`;
  let day = `${(timestampStr.getDate() + '').padStart(2, '0')}`;
  let hour = timestampStr.getHours();
  let minute = timestampStr.getMinutes();
  let second = timestampStr.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

module.exports = { timestampToString }