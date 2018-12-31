const { FUNCTIONS } = require('../consts/aql')
const convertToSnakecase = require('../helpers/convertToSnakecase')

class AQLFuncs {
  constructor() {
    for (let name of FUNCTIONS) {
      let funcName = convertToSnakecase(name).toUpperCase()
      this[name] = (...args) => {
        return this.func.apply(null, [funcName].concat(args))
      }
    }
  }

  func(name, ...args) {
    let str = JSON.stringify(args)
    // hack - I don't know of a better way to do this
    // this replaces \" with " and " with '
    str = str.split('\\"').join('DBL_QUOTE').split('"').join(`'`).split('DBL_QUOTE').join('"')
    // remove outer array
    str = str.substring(1, str.length - 1)
    // convert function name to uppercase
    str = `${name}(${str})`

    // find any @vars and replace them with references
    str = str.replace(/"@{(\w+)}[\w.``]+"/gi, (match, name) => {
      // remove outer quotes
      let val = match.substring(1, match.length - 1)
      return val
    })

    // if there is already an express @{} remove it
    str = str.replace(/['"]@{(.+?)}['"]/gi, '$1')

    return '@{' + str + '}'
  }

  parseRefs(refs, str) {
    return str.replace(/@(\w+)/gi, (match, word) => {
      return refs[word] ? refs[word] : match
    })
  }
}

module.exports = new AQLFuncs()
