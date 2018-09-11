const orango = require('orango')
const app = require('../app')
const Post = orango.model('Post')
const User = orango.model('User')

app.get('/posts', async (req, res) => {
  let query = {}
  let posts
  try {
    if (req.query.user) {
      // this is more optimized when we know that user is only one user and we know which user
      query.user = req.query.user
      posts = await Post.findMany(query, {
          noDefaults: false
        })
        .var('user', User, req.query.user)
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        .populate('user', 'user', { // we are using the var as the 2nd param in populate we declared above
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
        .toAQL()
      // AQL below 
      // LET user = DOCUMENT('users/rob') 
      //     FOR doc IN posts 
      //     FILTER (doc.`user` == "rob") 
      //     RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    } else {
      // we use this when the user could be one or more users, but we dont know which user
      posts = await Post.findMany(query, {
          noDefaults: false
        })
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        .populate('user', User, { // we are using the Model (as a lookup) in the 2nd param to auto populate
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
        .toAQL()
      // AQL below
      // FOR doc IN posts 
      // LET user = DOCUMENT(CONCAT('users/', doc.user)) 
      // RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    }
    res.send(posts)
  } catch (e) {
    res.send('error: ' + e.message)
  }
})

app.get('/posts/:id', async (req, res) => {

})