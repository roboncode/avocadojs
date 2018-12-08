const keywords = 'FOR FILTER LET LIMIT REMOVE RETURN'.split(' ')
const regexPhrase = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g')
const SPACES = '   '
const NEWLINE = '\n'

function formatAQL(aql) {
  let indent = ''
  let prettyAQL = ''
  let lastPhraseType = ''
  let phrases = aql.replace(regexPhrase, '\n$1').substr(1).split('\n')

  for (let i = 0; i < phrases.length; i++) {
    let phrase = phrases[i]
    if (phrase.match(/\bFOR\b/g)) {
      indent += SPACES
      prettyAQL += phrases[i] + NEWLINE + indent
      lastPhraseType = 'FOR'
    } else if (phrase.match(/\bFILTER\b/g)) {
      prettyAQL += phrases[i] + NEWLINE + indent
      lastPhraseType = 'FILTER'
    } else if (phrase.match(/\LET\b/g)) {
      prettyAQL += NEWLINE + indent + phrases[i]
      indent += SPACES
      prettyAQL += NEWLINE + indent
      lastPhraseType = 'LET'
    } else if (phrase.match(/\RETURN\b/g)) {
      if (lastPhraseType === 'RETURN') {
        prettyAQL += NEWLINE + indent
      }
      indent = indent.substr(SPACES.length * 2)
      prettyAQL += phrases[i] + NEWLINE + indent
      lastPhraseType = 'RETURN'
    } else {
      prettyAQL += phrases[i] + NEWLINE + indent
      lastPhraseType = ''
    }
  }
  return prettyAQL
}

module.exports = formatAQL
