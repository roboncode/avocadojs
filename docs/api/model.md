---
pageClass: api
---

# Model

## Declaring models

This section will focus on declaring models. There separate sections for the API and defining schemas.

### Async / Await

Examples that have and await need to be used inside an `async` function . To avoid redundancy, the examples have been omitted this step. Alternatively, if you prefer the traditional `Promise`, you could use this method in place of `await`.

```js
async function myFunc() {
  await content_here
}
```

### Declaring a model

You do not need to declare _key.  It will be added automatically to all models.

```js
orango.model('User', {
  name: String
})
```

### Declaring the collection
```js
orango.model('User', {
  name: String
}, 'my_users')
```

Declaring the schema separately
```js
let schema = orango.Schema({
  name: String
})
orango.model('User', schema)
```

### Declaring strict mode

Strict mode will prevent any unknown properties from being inserted into the database.

```js
let schema = orango.Schema({
  name: String
}, {
  strict: true
})
orango.model('User', schema)
```

### Indexing properties

```js
let schema = orango.Schema({
  name: String,
  email: String
}, {
  strict: true,
  indexes: [{
    type: 'hash',
    fields: ['email']
  }]
})
orango.model('User', schema)
```

### Auto-Indexing properties

> Not currently implemented

```js
let schema = orango.Schema({
  name: String,
  email: String
}, {
  strict: true,
  autoIndex: true
})
orango.model('User', schema)
```

### Keeping your documents clean

```js
let schema = orango.Schema({
  name: String,
  email: String,
  language: { type: String, default: 'en_US' }
}, {
  strict: true,
  removeOnMatchDefault: true
})
orango.model('User', schema)
```
Let's look at two examples...

```js
// will be saved into document
user.language = 'es_SP'

// will not be saved into document
user.language = 'es_US'
```


## Referencing a model

```js
const User = orango.model('User')
```

## Creating a new document

Properties can be assigned during or after construction.

```js
let user = new User({
  name: 'John Smith'
})
user.email = 'john.smith@gmail.com'
await user.save()
```

## Fetching documents

### Finding many documents

```js
let users = await User.findMany({ active: true })
// or user the alias find()
let users = await User.find({ active: true })
```

### Paginating results

```js
let users = await User.find({ active: true }).limit(10).offset(20)
```

### Finding one document

```js
let user = await User.findOne({ active: true, email: 'john.smith@gmail.com' })
```

### Finding with condition statements

By default adding multiple properties to the query criteria are treated as `AND` statements. Orango also support other conditional statements. Conditions can be grouped within each other.

**AND statements**

```js
// (active == true AND email == john.smith@gmail.com)
{ active: true, email: 'john.smith@gmail.com'}
```

**OR statements**

```js
// (email == 'john.smith@gmail.com' OR email == jane.doe@gmail.com)
{ 
  $or: [
    { email: 'john.smith@gmail.com' }, 
    { email: 'jane.doe@gmail.com' }
  ] 
}
```

**EQUALS TO statements**

```js
// (email == john.smith@gmail.com)
{ email: { $eq: 'john.smith@gmail.com' } }
```

**GREATER THAN statements**

```js
// (count > 1)
{ count: { $gt: 1 } }
```

**GREATER THAN OR EQUALS TO statements**

```js
// (count >= 1)
{ count: { $gte: 1 } }
```

**LESS THAN statements**

```js
// (count < 1)
{ count: { $lt: 1 } }
```

**LESS THAN OR EQUALS TO statements**

```js
// (count <= 1)
{ count: { $lte: 1 } }
```

### Finding one document by _key

```js
let user = await User.findById('12345')
```

### Finding documents using a custom query

You can create custom queries still using all the features of Orango.  The criteria does not include the return statements. That is broken into a separate function. Let's look at a few examples...

**Example #1 - Using special variables**

In the example below, a single document is returned.  The optional variables `@@doc` and `@@collection` will be replaced automatically using the model's name. 

```js
let user = await User.findByQuery(`
  FOR @@doc IN @@collection 
  FILTER @@doc.email == 'john.smith@gmail.com'
`)
.id()
.return(RETURN.DOC)
```

**Example #2 - Custom return statement**

```js
let user = await User.findByQuery(`
  FOR user IN users 
  FILTER user.email == 'john.smith@gmail.com'
`)
.id()
.return(`{ user: UNSET(user, 'password') }`)
```

**Example #3 - Returning a model**

```js
let user = await User.findByQuery(`
  FOR @@doc IN @@collection 
  FILTER @@doc.email == 'john.smith@gmail.com'
`)
.id()
.return(RETURN.MODEL)
```

## Modifying return documents

Orango provides several means to manipulate documents on the return;

### Returning an `id`

This will strip `_id`, `_key` and `_rev` and return `_key` as the property `id`.

```js
let user = await User.findOne({ email: 'john.smith@gmail.com' }).id()
```

### 