const aryIndexRx = /\[(.*?)\]/g

const delimiter = '.'

function isUndefined(val) {
  return typeof val === 'undefined'
}

function pathToArray(path = '', data) {
  if (path instanceof Array) {
    return path
  }

  path = path.replace(aryIndexRx, function(m, g1) {
    if (g1.indexOf('"') !== -1 || g1.indexOf("'") !== -1) {
      return delimiter + g1
    }

    return delimiter + resolve(data).get(g1)
  })

  return path.split(delimiter)
}

class Resolve {
  constructor(data = {}) {
    this.rawData = data
  }

  get(path, extract = false) {
    let data = this.rawData,
      prev = data,
      arr = pathToArray(path, data),
      prop = '',
      i = 0,
      len = arr.length

    while (data && i < len) {
      prop = arr[i]

      prev = data

      data = data[prop]

      if (data === undefined) {
        return data
      }

      i += 1
    }

    if (extract) {
      delete prev[prop]
    }

    return data
  }

  set(path, value) {
    if (isUndefined(path)) {
      throw new Error('Resolve requires "path"')
    }

    let data = this.rawData,
      arr = pathToArray(path, data),
      prop = '',
      i = 0,
      len = arr.length - 1

    while (i < len) {
      prop = arr[i]

      if (data[prop] === undefined) {
        data = data[prop] = {}
      } else {
        data = data[prop]
      }

      i += 1
    }

    if (arr.length > 0) {
      data[arr.pop()] = value
    }

    return this.rawData
  }

  default(path, value) {
    if (isUndefined(this.get(path))) {
      this.set(path, value)
    }
  }

  clear() {
    let d = this.rawData

    for (let e in d) {
      if (d.hasOwnProperty(e)) {
        delete d[e]
      }
    }
  }

  path(path) {
    return this.set(path, {})
  }
}

let resolve = function(data) {
  return new Resolve(data)
}

// Add a comment to this line
module.exports = resolve
