const orango = require('../../../lib')
require('../models/User')
require('../models/Tweet')
require('../models/Like')

const Like = orango.model('Like')

async function main() {
  await orango.connect('sample')
  // await Like.link("foo", "bar")
  await Like.link("foo", "bar", { message: 'test1'})
  // await Like.link({_to: 'test/foo', _from: 'test/bar', message: 'test2'})
  // await Like.link({to: 'foo', from: 'bar', message: 'test3'})
  // await Like.link({User: 'foo', Tweet: 'bar', message: 'test4'})
}

main()
