function parseArrayPaths(data) {
  var result = {}
  let props = []
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      // for (var i = 0, l = cur.length; i < l; i++)
      //   recurse(cur[i], prop ? prop + '.' + i : '' + i)
      // if (l == 0) { result[prop] = []}
      result[prop] = []
      props.push(prop)
    } else {
      var isEmpty = true
      for (var p in cur) {
        isEmpty = false
        if (!cur[p].type) {
          recurse(cur[p], prop ? prop + '.' + p : p)
        }
      }
      // if (isEmpty) { result[prop] = {}}
    }
  }
  recurse(data, '')
  return props
}

module.exports = parseArrayPaths
