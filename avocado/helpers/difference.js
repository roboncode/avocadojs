/**
 * https: //gist.github.com/Yimiprod/7ee176597fef230d1451
 */
const {
  transform,
  isEqual,
  isObject
} = require('lodash')

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
}

module.exports = difference