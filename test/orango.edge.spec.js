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
    // :: USER :: //
    const UserSchema = orango.Schema({
      name: String
    })
    User = await orango.model('User', UserSchema).onConnected

    // :: POST :: //
    const PostSchema = orango.Schema({
      author: String,
      text: String
    })
    Post = await orango.model('Post', PostSchema).onConnected

    // :: LIKE :: //
    const LikeSchema = orango.EdgeSchema('users', 'posts')
    Like = await orango.model('Like', LikeSchema).onConnected
  })

  async function createDocs() {
    john = new User({ name: 'John' })
    await john.save()

    jane = await new User({ name: 'Jane' })
    await jane.save()

    post = await new Post({ author: john._key, text: 'Hello, world!' })
    await post.save()

    like = await new Like(jane._key, post._key)
    await like.save()
  }

  describe('creates an edge collection', function() {
    it('create an edge collection', async function() {
      const schema = orango.Schema(
        {
          name: String
        },
        {
          edge: true
        }
      )
      await orango.model('EdgeTest', schema).ready
      const cols = await orango.connection.db.listCollections()
      let str = JSON.stringify(cols)
      expect(str).to.contain('edge_tests')
    })
  })

  describe('findByEdge - find User', function() {
    it('should use an edge collection to perform joins', async function() {
      await createDocs()

      let likedUsers = await User.findByEdge(Like, post._key, {
        noDefaults: true
      }).limit(1)

      expect(likedUsers).to.deep.equal({
        _key: jane._key,
        _id: jane._id,
        _rev: jane._rev,
        name: jane.name
      })
    })
  })

  describe('findByEdge to AQL', function() {
    it('return an AQL', async function() {
      await createDocs()

      let aql
      try {
        aql = await User.findByEdge(Like, post._key, {
          noDefaults: true
        })
          // .limit(1)
          .toAQL()
      } catch (e) {
        aql = e.message
      }
      expect(aql).to.match(
        /FOR doc IN INBOUND "posts\/\w+" likes RETURN DISTINCT doc/
      )
    })
  })

  describe('findByEdge - find Post', function() {
    it('should use an edge collection to perform joins', async function() {
      await createDocs()

      let likedPosts = await Post.findByEdge(Like, jane._key, {
        noDefaults: true
      })

      expect(likedPosts).to.deep.equal([
        {
          _key: post._key,
          _id: post._id,
          _rev: post._rev,
          author: john._key,
          text: post.text
        }
      ])
    })
  })

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

  describe('remove from Like with user and post', function() {
    it('should remove a single item', async function() {
      await createDocs()
      let result = await Like.removeFromEdge(jane, post)
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
