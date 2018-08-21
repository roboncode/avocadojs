function returnToAQL(returnVals, doc) {
  let returnList = returnVals.split(' ')
  returnList.unshift('_key')
  let returnObj = {}

  for (let i = 0; i < returnList.length; i++) {
    let prop = returnList[i]
    returnObj[prop] = `${doc}.${prop}`
  }
  let str = JSON.stringify(returnObj)
  str = str.replace(/"/gi, " ")
  return str
}

module.exports = returnToAQL
