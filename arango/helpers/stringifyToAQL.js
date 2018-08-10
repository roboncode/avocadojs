function stringifyToAQL(data) {
  return JSON.stringify(data).replace(/(\w+):/g, "`$1`:")
}

module.exports = stringifyToAQL