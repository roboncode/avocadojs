// https://repl.it/@flashext/Convert-PlusPlus-to-Expr

function iterate(data, handler, path = []) {
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      let val = data[prop]
      path.push(prop)
      handler(data, prop, val, path)
    }
    path.length = 0
  }
  return data
}

module.exports = iterate