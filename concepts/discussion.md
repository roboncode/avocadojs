Right, I see what you want to achieve and I understand how it could provide value.

Orango is setup as an ODM sprinkled with ORM. While I have created an simple internal ORM, it does not currently contain mechanics needed to achieve the example you have provided.

As I have thought about the implementation, I think a user would use it like this...

```js
// models/User.js
const User = orango.model({ name: String })
User.hasMany('Post')
User.hasMany('Comment', { as: 'post_comments' })

// models/Post.js
const Post = orango.model({
  user: { type: String },
  text: String
})
Post.belongsTo('User')
Post.hasMany('Comment')

// models/Comment.js
const Comment = orango.model({
  post: { type: String },
  user: { type: String },
  text: String
})
Comment.belongsTo('Post')
Comment.belongsTo('User')
```

Then you would be able to perform a query like...

```js
let posts = await Post.
  find().
  limit(10).
  populate([
    { model: 'User', computed: true, select: 'firstName lastName' },
    { model: 'Comment', limit: 10, computed: true },
    { model: 'Comment.User', computed: true, select: 'firstName lastName' }
  ])
  .computed()
```

...or create a JSON query schema (which I think I prefer)...

```js
let query = {
  model: 'Post',
  filter: {},
  limit: 10,
  populate: [
    { model: 'User', computed: true, select: 'firstName lastName' },
    { model: 'Comment', limit: 10, computed: true },
    { model: 'Comment.User', computed: true, select: 'firstName lastName' }
  ],
  id: true,
  computed: true
}
  
let posts = await orango.exec(query)
```

The result would be...

```js
[
  {
    _key: '1',
    text: 'Hello, world!'
    user: { _key: '1', firstName: 'John', lastName: 'Smith' }
    post_comments: [
      {
        _key: 1, text: 'Hello, world!',
        user: { _key: '1', firstName: 'Jane', lastName: 'Doe' }
      }
      ...
    ]
  }
  ...
]
```
