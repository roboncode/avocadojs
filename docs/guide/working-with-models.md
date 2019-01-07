---
pageClass: guide
---

# Working with models

Models represent a concrete data structure. Aside from defining the structure of your
documents and data types, models can handle the definition of:

* Validators
* Default values
* Indexes
* Static methods
* Computed properties
* Hooks
* Custom queries
* Unknown property filters
* JSON to model structures
* Joi definitions

## Defining a model

```js
orango.model(name: String, classRef:OrangoModel [, collectionName:String])
```

Models are JavaScript classes. A model's class should extend `orango.Model`. You register your class as a model
using `orango.model()`.

```js
class User extends orango.Model {}

orango.model('User', User)
```

## Retrieving a model

To reference a model, use the same `model()` function as a getter.

```js
const User = orango.model('User')
```

Once Orango is connected to ArangoDB, a collection for the model will be created. By default, Orango will
create the collection as a pluralized name of the class. The collection for our model `User` would be
`users`.

You can override the default name with the last parameter.

```js
orango.model('User', User, 'my_users')
```

## Prevent collection creation

If you do not wish your model to have a collection created, pass `false` as the last parameter.

```js
orango.model('User', User, false)
```

## Adding a schema

Models can use a schema to validate and filter properties. The schema must be added as a static property on the
class. It also must be passed into the `super(data, schema)`. These two references are used internally during
validation and connectivity to the database.

```js
class User extends orango.Model { 
  constructor(data) {
    super(data, User.schema)
  }
}

User.schema = orango.schema({
  firstName: String,
  lastName: String,
  email: { type: String, email: {} }
  age: { type: Number, min: 18 },
  bio: { type: String, regex: /[a-z]/ },
  created: Date,
  updated: Date
})

orango.model('User', User)
```

## Adding a struct

Structs are used to link models with other models. Structs define how to
convert a plain old JSON object into a fully instantiated set of models. 
Structs can go any level deep in their definition.

```js
class User extends orango.Model {}

User.struct = {
  settings: 'Settings' // references another model
}
```

## Adding hooks

Hooks can be used to insert default data or make changes to data prior to it being inserted
in the database. There are two hooks you can define to intercept models prior to an `insert` or `update`
into the database. These hooks will also be invoked when performing an `upsert`. The
model instance is passed in as the first parameter.

```js
User.hooks = {
  insert(model) {
    model.created = Date.now()
  },
  update(model) {
    model.updated = Date.now()
  }
}
```

> Hooks also support `async` tasks by returning a promise or declaring the hook `async`.

## Tips and tricks

### Custom static methods

Since the model is a class you can create static methods. Those static methods can
use the static methods that are on the `Model` class. For example...

```js
class User extends orango.Model {
  constructor(data) {
    super(data, User.schema)
  }

  static async findByEmail(email) {
    return await this.find().one().where({ email })
  }
}
```

### Computed properties

You can add additional data through getters that is returned as part of your results by
overriding the `toJSON()` method.

```js
class User extends orango.Model {
  constructor(data) {
    super(data, User.schema)
  }

  toJSON() {
    return Object.assign({}, this, {
      fullName: (this.firstName + ' ' + this.lastName).trim()
    })
  }
}
```

### Putting it all together

Here is an example defining a model with a schema and struct.

```js
class User extends orango.Model {
  constructor(data) {
    super(data, User.schema)
  }

  static async findByEmail(email) {
    return await this.find().one().where({ email })
  }

  toJSON() {
    return Object.assign({}, this, {
      fullName: (this.firstName + ' ' + this.lastName).trim()
    })
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

User.hooks = {
  insert(model) {
    model.created = Date.now()
  },
  update(model) {
    model.updated = Date.now()
  }
}

User.model('User', User)
```

## Using the Model's API

Orango's Model class has a query builder which daisy-chains methods. It uses this
approach to construct a query object to invoke AQL calls to the database.

Let's say you wanted to fetch users from the `users` collection in the database. To
fetch documents, you would call the `find()` method.

```js 
let results = await User.find()
```

To add a condition statement, add `where()` to the builder.

```js
let results = await User.find().where({ active: true })
```

To limit the results add `limit()` to the chain.

```js
let results = await User.find().where({ active: true }).limit(50)
```

When `inserting`, `updating` or `deleting`, the affected documents are not returned by default.
You need to request them. Use `return()` to get back the affected documents. You will receive the results in an array,
since more than one document could be affacted.

```js
let results = await User.update({ active: false })
  .where({ email: 'john@gmail.com' }).limit(1)
  .return()
```

To have only one document returned the `return` query object `return()`.

```js
let result = await User.update({ active: false })
  .where({ email: 'john@gmail.com' }).limit(1)
  .return(orango.return.one())
```

The query will return the object as JSON to avoid unnecessary computations. If you want to have the results
cast as models, use `fromJSON()`. 

> `fromJSON()` accepts an array or single object.

```js
let result = await User.update({ active: false })
  .where({ email: 'john@gmail.com' }).limit(1)
  .return(orango.return.one())

let user = User.fromJSON(result)
```

## Querying without `await`

If you want to perform a query without waiting for a response use `exec()`.  Even though
`exec()` returns a promise the query will be executed, even if there are no subscribers.
This can be useful if you are building your query around conditions.

```js
let query = User.update( { active: false })

if(email) {
  query.where({ email }).limit(1)
}

if(returnOne) {
  query.return(orango.return.one())
} else {
  query.return()
}

query.exec()
```

## Conditional statements

Conditions are created using JSON and are treated as `AND` statements by default.

```js
// (active == true AND email == john.smith@gmail.com)
{ active: true, email: 'john.smith@gmail.com'}
```

You can create other symbols using special `$` properties.

* **$or** (or)
* **$eq** (equals to)
* **$gt** (greater than)
* **$gte** (greater than or equal to)
* **$lt** (less than)
* **$lte** (less than or equal to)

### Full example

```js
{
  // (email == 'john.smith@gmail.com' OR email == jane.doe@gmail.com)
  $or: [
    { email: 'john.smith@gmail.com' },
    { email: 'jane.doe@gmail.com' }
  ],

  // (email == john.smith@gmail.com)
  email: { $eq: 'john.smith@gmail.com' },

  // (count > 1)
  count: { $gt: 1 },

  // (count >= 1)
  count: { $gte: 1 },

  // (count < 1)
  count: { $lt: 1 },

  // (count <= 1)
  count: { $lte: 1 }
}
```

Visit the [Model API documentation](/api/model.md) to learn more about models.