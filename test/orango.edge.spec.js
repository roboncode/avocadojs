
describe('edge connections', function() {

  let orango;
  let john
  let jane
  let post
  let Like
  let User
  let Post


  beforeAll(async(done) => {
    orango = global.__ORANGO__;
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
    const LikeSchema = orango.EdgeSchema('User', 'Post')
    Like = await orango.model('Like', LikeSchema)
    done()
  })

  async function createDocs() {
    john = new User({ /*_key: 'john',*/ name: 'John' })
    await john.save({ isNew: true })

    jane = new User({ /*_key: 'jane'*/ name: 'Jane' })
    await jane.save({ isNew: true })

    post = new Post({ /*_key: 'post',*/ author: john._key, text: 'Hello, world!' })
    await post.save({ isNew: true })

    await Like.link(jane._key, post._key)
  }

  describe('creates an edge collection', function() {
    it('create an edge collection', async function() {
      const schema = orango.EdgeSchema('a', 'b')
      await orango.model('EdgeTest', schema)

      const cols = await orango.connection.db.listCollections()

      let str = JSON.stringify(cols)
      expect(str).toContain('edge_tests')
    })
  })

//   describe('findByEdge - find User', function() {
//     it('should use an edge collection to perform joins', async function() {
//       await createDocs()

//       let result = await User.findByEdge(Like, post._key).limit(1)

//       expect(result).toEqual({
//         _key: jane._key,
//         _id: jane._id,
//         _rev: jane._rev,
//         name: jane.name
//       })
//     })
//   })

//   describe('findByEdge to AQL', function() {
//     it('return an AQL', async function() {
//       await createDocs()

//       let aql
//       try {
//         aql = await User.findByEdge(Like, post._key)
//           // .limit(1)
//           .toAQL()
//       } catch (e) {
//         aql = e.message
//       }

//       expect(aql).toMatch(/FOR \$user IN INBOUND "posts\/\w+" likes RETURN DISTINCT \$user/)
//     })
//   })

//   describe('findByEdge - find Post', function() {
//     it('should use an edge collection to perform joins', async function() {
//       await createDocs()

//       let likedPosts = await Post.findByEdge(Like, jane._key)

//       expect(likedPosts).toEqual([
//         {
//           _key: post._key,
//           _id: post._id,
//           _rev: post._rev,
//           author: john._key,
//           text: post.text
//         }
//       ])
//     })
//   })

//   describe('remove from Like with post', function() {
//     it('should remove a single item', async function() {
//       await createDocs()
//       let result = await Like.unlink(null, post._key)
//       // .toAQL()
//       expect(result.deleted).toBe(1)
//     })
//   })

//   describe('remove from Like with user', function() {
//     it('should remove a single item', async function() {
//       await createDocs()
//       let result = await Like.unlink(jane._key)
//       // .return('doc')
//       // .toAQL()
//       expect(result.deleted).toBe(1)
//     })
//   })

//   describe('remove from Like with user id and post id', function() {
//     it('should remove a single item', async function() {
//       await createDocs()
//       let result = await Like.unlink(jane._key, post._key)
//       expect(result.deleted).toBe(1)
//     })
//   })
})
