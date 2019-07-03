export function unmarshal(data: any, v: any): Error {
  try {
    let props = Object.getOwnPropertyNames(v)
    for (let prop of props) {
      if (
        typeof v[prop] === 'object' &&
        typeof data[prop] === 'object' &&
        !(v[prop] instanceof Array)
      ) {
        unmarshal(data[prop], v[prop])
      } else if (data.hasOwnProperty(prop)) {
        v[prop] = data[prop]
      }
    }
    return null
  } catch (err) {
    return err
  }
}
