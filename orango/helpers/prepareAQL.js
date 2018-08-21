function prepareAQL(data, name = '') {
  let returnVal = {}
  let encodedAQL = ''
  if (name) {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        returnVal[name + '.' + i] = data[i]
      }
    }
    let AQL = JSON.stringify(returnVal)
    encodedAQL = AQL.replace(/"(\w+).(\w+)"/g, "$1.`$2`")
  } else {
    returnVal = data
    encodedAQL = JSON.stringify(returnVal)
  }

  return encodedAQL
}

module.exports = prepareAQL