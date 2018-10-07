function objectToArray(data) {
  if (data instanceof Array) {
    return data
  }
  let list = []
  for (let e in data) {
    if (data.hasOwnProperty(e)) {
      let item = data[e]
      item._key = item._key || e
      list.push(item)
    }
  }
  return list
}

module.exports = objectToArray
