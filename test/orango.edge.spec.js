let expect = require('chai').expect
let orango = require('../lib')

describe('edge connections', function() {
  let john
  let jane
  let post
  let like
  let Like
  let User
  let Post

  before(async function() {
    await orango.connect('test')

    const schema = orango.Schema(
      {
        name: String
      },
      {
        strict: true
      }
    )
    orango.model('SimpleTest', schema)

    // :: USER :: //
    const UserSchema = orango.Schema({
      name: String
    })
    User = orango.model('User', UserSchema)

    // :: POST :: //
    const PostSchema = orango.Schema({
      author: String,
      text: String
    })
    Post = orango.model('Post', PostSchema)

    // :: LIKE :: //
    const LikeSchema = orango.EdgeSchema('users', 'posts')
    Like = orango.model('Like', LikeSchema)
  })

  function createDocs() {
    return Promise(async resolve => {
      john = new User({ name: 'John' })
      await john.save()

      jane = new User({ name: 'Jane' })
      await jane.save()

      post = new Post({ author: john._key, text: 'Hello, world!' })
      await post.save()

      like = new Like(jane._key, post._key)
      await like.save()

      setTimeout(resolve, 1000)
    })
  }

  describe('remove from user', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await post.removeFromEdge(Like, jane._key)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('remove from Like with post', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await Like.removeFromEdge(post)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('remove from Like with user', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await Like.removeFromEdge(jane)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('remove from Like with user id and post id', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await Like.removeFromEdge(jane._key, post._key)
      expect(result.deleted).to.equal(1)
    })
  })

  describe('remove from post', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await jane.removeFromEdge(Like, post._key)
      expect(result.deleted).to.equal(1)
    })
  })
})
