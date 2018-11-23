let user = await User.create({
  name: 'John Smith'
})

aql.query('FOR user IN users RETURN user', { model: User })

// Let's define some models
const User = orango.model({ name: String })
const Post = orango.model({ user: String, text: String })
const Comment = orango.model({ post: String, user: String, text: String })

// Find Posts (limit to 10) and 
// populate with comments (limit to 10) and 
// populate user of each comment
Post
  .find()
  .limit(10)
  .populate({ user: User
    .findById('@@parent._key') 
  })
  .populate({ comments: Comment
    .find({post: '@@parent._key'})
    .limit(10)
    .populate({
      user: 
        User.findById('@@parent._key')
    })
  })

const User = orango.model({ name: String })
const Post = orango.model({ 
  user: { type: String, model: 'User' }, 
  text: String 
})
const Comment = orango.model({ 
  post: { type: String, model: 'Post' }, 
  user: { type: String , model: 'User'}, 
  text: String 
})

Post
  .find()
  .limit(10)
  .populate('user') // expects model reference in schema
  .populate('comments', Comment // is not in schema but poulated by query
    .find({ post: '@@parent._key' })
    .limit(10)
    .populate('user')
  )

const User = orango.model({ name: String })
const Post = orango.model({ 
  user: { type: String, model: 'User' }, 
  text: String 
})
const Comment = orango.model({ 
  post: { type: String, model: 'Post' }, 
  user: { type: String , model: 'User'}, 
  text: String 
})

async function getPosts(req, res) {
  let includes = req.query.include.split(',')

  let PostQuery = Post.find().limit(10)

  if(includes.indexOf('user')) {
    PostQuery.populate('user') // expects model reference in schema (not currently implemented)
  }

  if(includes.indexOf('comments')) {
    let CommentQuery = Comment // is not in schema but poulated by query
    .find({ post: '@@parent._key' })
    .limit(10)

    if(includes.indexOf('comment_user')) {
      CommentQuery.populate('user')  // expects model reference in schema (not currently implemented)
    }
  
    PostQuery.populate('comments', CommentQuery)
  }

  let posts = await PostQuery.exec()
  res.send(posts)
}

Post.find()
  .limit(10)
  .populate











  