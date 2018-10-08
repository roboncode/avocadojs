function parseParams(url, hash) {
  for (let e in hash) {
    if (hash.hasOwnProperty(e)) {
      let regExp = new RegExp(':(' + e + ')\\b', 'g')
      if (regExp.test(url)) {
        url = url.replace(regExp, hash[e])
        delete hash[e]
      }
    }
  }
  url = url.replace(/\/:\w+/gi, '') // strip any "/:ids" that were still remaining
  url = url.replace(/\/$/gi, '') // strip trailing slash "/"
  return url
}

function parseQuery(url, hash) {
  if (url.indexOf('?') !== -1) {
    let queryParams = []
    const baseUrl = url.split('?').shift()
    const params = url
      .split('?')
      .pop()
      .split('&')
    for (let i = 0; i < params.length; i++) {
      const param = params[i]
      if (hash[param] !== undefined) {
        queryParams.push(param + '=' + encodeURIComponent(hash[param]))
      }
    }
    return baseUrl + '?' + queryParams.join('&')
  }
  return url
}

function parseUrl(url, hash) {
  url = parseParams(url, hash)
  url = parseQuery(url, hash)
  return url
}

export default parseUrl
