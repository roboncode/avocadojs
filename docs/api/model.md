---
pageClass: api
---

# Model

Models represent a concrete data structure. They can contain a schema and structure that will be used to 
validate the data it represents and extend the data's functionality with methods and properties.

## Defining a model

```js
orango.model(name: String, classRef:OrangoModel [, collectionName:String])
```

Models are JavaScript classes. The class extends `OrangoModel`. Once you have a class defined, you 
register it as a model with Orango.

```js
class User extends orango.Model {}

orango.model('User', User)
```

Once Orango is connected to ArangoDB, a collection for the model will be created. By default, Orango will
create the collection as a pluralized name of the class. The collection for our model `User` would be
`users`.

You can override the default name with the last parameter.

```js
orango.model('User', User, 'my_users')
```

## Adding a schema

Models can use a schema to validate and filter properties. The schema is added as a static property on the
class. It also is passed into the `super()`

```js
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
```

### Adding a struct

Structs are used to link models with other models. By defining structs you can
convert a plain old JSON object into a fully instantiated model with subnodes
as models. Structs can go any level deep.

```js
class User extends orango.Model {}

User.struct = {
  settings: 'Settings' // references another model
}
```

## Putting it all together

Here is an example defining a model with a schema and struct.

```js
class User extends orango.Model {
  constructor(data) {
    super(data, User.schema)
  }
}

User.schema = orango.schema({
  email: String,
  firstName: String,
  lastName: String
})

User.struct = {
  settings: 'Settings'
}

User.model('User', User)
```

## Retrieving a model

To reference a registered model, use the same `model` function as a getter.

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

By default adding multiple properties to the query filter are treated as `AND` statements. Orango also support other conditional statements. Conditions can be grouped within each other.

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

You can create custom queries still using all the features of Orango.  The filter does not include the return statements. That is broken into a separate function. Let's look at a few examples...

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