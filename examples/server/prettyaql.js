const keywords = 'FOR FILTER LET LIMIT REMOVE UPDATE RETURN'.split(' ')
const regexPhrase = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g')
const TAB = '   '
const NEWLINE = '\n'

let pad = ''

function clear() {
  pad = ''
}

function indent() {
  pad += TAB
}

function outdent() {
  pad = pad.substr(TAB.length * 2)
}

function formatAQL(aql) {
  let prettyAQL = ''
  let phrases = aql.replace(regexPhrase, '\n$1').substr(1).split('\n')

  for (let i = 0; i < phrases.length; i++) {
    let phrase = phrases[i].trim()
    if (phrase.match(/\bFOR\b/g)) {
      prettyAQL += NEWLINE + pad + phrase
      indent()
    } else if (phrase.match(/\bLET\b/g)) {
      prettyAQL += NEWLINE + NEWLINE + pad + phrase
      indent()
    } else if (phrase.match(/\bRETURN\b/g)) {
      // outdent()
      prettyAQL += NEWLINE + pad + phrase
    } else if (phrase.match(/\bUPDATE|REMOVE\b/g)) {
      prettyAQL += NEWLINE + pad + phrase
    } else {
      prettyAQL += NEWLINE + pad + phrase
    }
    if (prettyAQL.substr(-2) === '))') {
      prettyAQL = prettyAQL.substr(0, prettyAQL.length-2)
      outdent()
      prettyAQL += NEWLINE + pad + '))' + NEWLINE
    }
  }
  clear()
  return prettyAQL
}

module.exports = formatAQL
