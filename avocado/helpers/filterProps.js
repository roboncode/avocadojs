function diff(src, target) {
  return src.filter(function (i) {
    return target.indexOf(i) === -1
  })
}

function filterProps(schemaKeys, props) {
  let invalidKeys = diff(props, schemaKeys)
  return diff(props, invalidKeys)
}

module.exports = filterProps