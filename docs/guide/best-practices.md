# Tips and Tricks

These are some common patterns that you may want to consider using when developing
with Orango.

## Referencing orango instance

Rather than referencing `orango` directly, pass it into each controller or model
via injection. Here is very simple example.

**models/User.js**

```js
module.exports = orango => {
  let schema = new orango.Schema({
    firstName: String,
    lastName: String
  })

  return orango.model('User', schema)
}
```

**controllers/my_controller.js**

```js
module.exports = (app, orango) => {

  const User = orango.model('User')

  app.get('/users', async (req, res) => {
    return await User.find()
  })
}
```

**server.js**
```js
const orango = require('orango')
const db = orango.get('myapp')
const app = require('express')

async main() {
  require('./models/User')(db)

  await db.connect()

  require('./controllers/my_controller')(app, db)
}

main()
```

## Performing raw AQL queries

If you have a query that cannot be constructed via Orango, don't let that stop you. Build it
as AQL and you can still use Orango for parts. For example, Orango cannot currently construct the
following query, so the query is passed in directly as AQL. The results are then converted to models
after getting the results from the database.

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
  // convert results from JSON to models
  return User.fromJSON(results)
}
```

<o-tip type="👍">If you find something that Orango cannot do, submit an feature request.</o-tip>
