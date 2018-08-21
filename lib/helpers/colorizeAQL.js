const KEYWORDS = 'for in filter update with'.toUpperCase().split(' ')
let REGEX_KEYWORDS = (() => {
  let returnVals = []
  for (let i = 0; i < KEYWORDS.length; i++) {
    const keyword = KEYWORDS[i]
    returnVals.push(new RegExp(`\\b${keyword}\\b`, 'gi'))
  }
  return returnVals
})()

let str = 'FOR doc IN users'
for (let i = 0; i < REGEX_KEYWORDS.length; i++) {
  str.replace(REGEX_KEYWORDS[i], "`$1`:")
}

console.log(REGEX_KEYWORDS)