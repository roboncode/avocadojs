// https://jsperf.com/deep-copy-vs-json-stringify-json-parse/51
const deepCopyObject = function(o) {
  var r, i, l
  if (typeof o !== 'object') return o
  if (!o) return o
  if (o.constructor === Array) {
    r = []
    l = o.length
    for (i = 0; i < l; i++) r[i] = deepCopyObject(o[i])
    return r
  }
  r = {}
  for (i in o) r[i] = deepCopyObject(o[i])
  return r
}

// function clone(data = {}) {
//   return JSON.parse(JSON.stringify(data))
// }

module.exports = deepCopyObject
