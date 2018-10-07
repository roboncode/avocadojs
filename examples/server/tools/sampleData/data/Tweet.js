const textGen = require('txtgen')
const randomDate = require('random-datetime')
const users = ['rob', 'john', 'jane', 'mark', 'sam', 'bella', 'blake']
const tweetsPerUser = 10
const tweets = []
const now = new Date()

for (let i = 0; i < users.length; i++) {
  for (let n = 0; n < tweetsPerUser; n++) {
    tweets.push({
      user: users[i],
      text: textGen.sentence(),
      created: randomDate({ year: now.getFullYear(), month: now.getMonth() })
    })
  }
}

module.exports = tweets
