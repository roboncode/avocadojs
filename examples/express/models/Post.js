const orango = require('orango')

let schema = orango.Schema(
  {
    user: String,
    title: String,
    content: String
  },
  {
    strict: true
  }
)

schema.statics.getPostsByAuthor = function(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const User = orango.model('User')
      let posts = await this.findMany({ user: userId }, { noDefaults: false })
        .populate('user', User, userId, {
          select: 'firstName lastName',
          computed: true,
          noDefaults: true
        })
        // .toAQL()
      return resolve(posts)
    } catch (e) {
      return reject(e)
    }
  })
}

schema.statics.getPostsByAuthorAlt1 = function(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const User = orango.model('User')

      let posts = await this.findByQuery(
        `LET user = DOCUMENT('@@User/${userId}')
        FOR post IN @@Post 
        FILTER post.user == user._key`,

        { noDefaults: false }
      )
        .return('MERGE(post, { user: KEEP(user, "firstName", "lastName") })')
        .intercept(async post => {
          post.user = await new User(post.user).toObject({
            noDefaults: true,
            computed: true
          })
          return post
        })
        .toAQL()
      return resolve(posts)
    } catch (e) {
      return reject(e)
    }
  })
}

schema.statics.getPostsByAuthorAlt2 = function(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const User = orango.model('User')

      let posts = await this.findByQuery(
        `FOR user IN @@User
              FILTER user._key == '${userId}'
                FOR post IN @@Post
                  FILTER post.user == user._key`,

        { noDefaults: false }
      )
        .return('MERGE(post, { user: KEEP(user, "firstName", "lastName") })')
        .intercept(async post => {
          post.user = await new User(post.user).toObject({
            noDefaults: true,
            computed: true
          })
          return post
        })
        .toAQL()
      return resolve(posts)
    } catch (e) {
      return reject(e)
    }
  })
}

module.exports = orango.model('Post', schema)
