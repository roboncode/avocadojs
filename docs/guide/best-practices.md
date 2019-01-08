# Best Practices

These are some common patterns that you may want to consider using when developing
with Orango.

## Referencing Orango

Rather than using referencing `orango` directly, pass it into each controller or model
via injection. Here is very simple example.

```js
// models/User.js
module.exports = orango => {
  class User extends orango.Model {
    constructor(data) {
      super(data, User.schema)
    }
  }

  User.schema = orango.schema({
    firstName: String,
    lastName: String
  })

  orango.model('User', User)
}

// controllers/my_controller.js
module.exports = (app, orango) => {

  const User = orango.model('User')

  app.get('/users', async (req, res) => {
    return await User.find()
  })
}

// server.js
(async main() {
  const orango = require('orango')
  const db = orango.get('myapp')
  const app = require('express')

  require('./models/User')(db)

  await db.connect()

  require('./controllers/my_controller')(app, db)
})()
```

## AQL vs Orango

If you have a query that cannot be constructed via Orango, don't let that stop you. Build it
as AQL and you can still use Orango for parts. For example, Orango cannot construct the
following query. So here I built it up as AQL and then convert the results to User
models after receiving the query results.

```js
async function findMatches(userId) {
  let aql = `LET contacts = (
    FOR contact IN contacts
        FILTER contact.user == '${userId}'
        RETURN DISTINCT contact.email
    )
      
  FOR user IN users
      FILTER POSITION(contacts, user.email) == TRUE
      RETURN user`
  
  const cursor = await orango.query(aql)
  let results = cursor.all()
  let users = User.fromJSON(results)
  return users
}
```
> If you find something that Orango cannot do, submit an issue.
