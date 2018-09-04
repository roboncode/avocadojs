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
    // :: SIMPLE TEST :: //
    const schema = orango.Schema(
      {
        name: String
      },
      {
        strict: true
      }
    )
    await orango.model('SimpleTest', schema)

    // :: USER :: //
    const UserSchema = orango.Schema({
      name: String
    })
    User = await orango.model('User', UserSchema)

    // :: POST :: //
    const PostSchema = orango.Schema({
      author: String,
      text: String
    })
    Post = await orango.model('Post', PostSchema)

    // :: LIKE :: //
    const LikeSchema = orango.EdgeSchema('users', 'posts')
    Like = await orango.model('Like', LikeSchema)
  })

  async function createDocs() {
    john = new User({ name: 'John' })
    await john.save()

    jane = new User({ name: 'Jane' })
    await jane.save()

    post = new Post({ author: john._key, text: 'Hello, world!' })
    await post.save()

    like = new Like(jane._key, post._key)
    await like.save()
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
