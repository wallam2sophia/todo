const dayjs = require("dayjs")

function timeContinusData(timeArr){
  let resultArr = []
  let curArr = []
  let maxC = 0;
  let lastC = 0;
  if(timeArr.length <= 1){
    return [timeArr]
  }
  for(let i = 0; i <= timeArr.length-2; i++){
    let cur = timeArr[i]
    let next = timeArr[i + 1]
    if(dayjs(next).diff(dayjs(cur), 'day') === 1){
      curArr.push(cur)
    }else {
      curArr.length > 0 && resultArr.push([...curArr, cur]);
      curArr = []
    }
  }
  curArr.length > 0 && resultArr.push([...curArr, timeArr[timeArr.length -1]]) && (lastC = [...curArr, timeArr[timeArr.length -1]].length);
  resultArr.forEach(item => {
    if(item.length > maxC){
      maxC = item.length
    }
  })
  return [resultArr, lastC, maxC]
}

module.exports = { timeContinusData }