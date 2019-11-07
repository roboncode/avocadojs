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

<!-- **Using a model**

```js
let Post = orango.model("Post")

let post = new Post({
  author: "Rob Taylor",
  title: "My first post"
  body: "This is my first post."
  tags: ["orango", "example"]
})

post.save()
``` -->

## Defining a model

Models take a name and (schema or model). 

Once orango has successfully connected to the database, each model will point to a collection.
If the collection does not exist, one will be created. 

Orango uses [pluralize](https://github.com/blakeembrey/pluralize) to determine the collection's name. 
The pluralized name of the model is converted to `snake_case`. For example, the model `AccountSystem`
would be represented in the database as the `account_systems` collection. However, the name `Person` is converted to `people` using [pluralize](https://github.com/blakeembrey/pluralize). The last parameter passed into `model()` will override the default collection name.

A schema is used to define the data structure that makes up the document 

<o-tip type="note">A <code>class</code> is created automatically and registered.</o-tip>

You can define a model using a `name` and `schema`:

```js
orango.model(name: String, schema:Schema [, collectionName:String])
```

You an define a model with a `class`:

```js
orango.model(name: String, model: class, [, collectionName:String])
```

<o-tip type="note">Defining a model with a class will be covered in more detail in another section.</o-tip>

### Usage

```js
const schema = new orango.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
  settings: {
    scope: {
      type: String, 
      allow: ["draft", "private", "public"],
      default: "draft"
    }
  },
  created: { type: Date, default: Date.now },
  released: Date,
})

orango.model('Post', schema)
```

## Retrieving a model

To reference a model, use the same `model()` function as a getter.

```js
const User = orango.model('User')
```

## Prevent collection creation

If you have a model that does not represent a collection, you can
prevent orango from creating a one by passing `false` as the last parameter.

```js
orango.model('User', schema, false)
```

## Defining a schema

Models use schemas to validate, filter and define default properties. Orango uses the [Joi
validation library](https://github.com/hapijs/joi) using JSON syntax. Orango also extends Joi
with some additional features, like `default` and `required` properties on `inserts` and `updates`.

### Usage

```js
let schema = new orango.Schema({
  firstName: String,
  lastName: String
  role: { type: String, allow: ['user', 'admin', 'owner'], default: 'user' },
  // email: { type: String, email: {}, requiredOnInsert: true, requiredOnUpdate: true }
  email: { type: String, email: {}, required: 'insert' }
  age: { type: Number, min: 18 },
  tags: [String],
  bio: { type: String, regex: /[a-z]/ },
  created: { type: Date, default: Date.now },
  updated: { type: Date, defaultOnUpdate: Date.now }
})

orango.model('User', schema)
```

## Hooks

There are two hooks you can define to intercept models prior to an `insert` or `update`
into the database. The correct hook will also be invoked when performing an `upsert`. The
model instance is passed in as the first parameter.

<o-tip type="note">Hooks also support asynchronous tasks by returning a <code>Promise</code> or declaring the handler as <code>async</code>.</o-tip>

```js
const { EVENTS } = orango.consts
let schema = new orango.Schema({...})
let User = orango('User', schema)

User.on(EVENTS.INSERT, model => {
  // synchronous example
})

User.on(EVENTS.UPDATE, async model => {
  // asynchronous example
})
```

## Using Joi in the schema

In most cases, the JSON syntax meet the schema requirements. If you find the need to use
a more complex feature of Joi,
you can use Joi directly in the schema. 

Below is an condensed version of `Query` model used internally by orango to validate queries. In
the example below, the model needed to support a circular reference to itself and support alternative
types for the `return` value.

```js
const Joi = require('Joi')

const schema = new orango.Schema({
    model: { type: String, required: true },
    method: { type: String, default: 'find' },
    queries: [
      {
        let: String,
        query: Joi.lazy(() => schema._validator.joi).description(
          'Query schema'
        )
      }
    ],
    sort: Joi.any(),
    return: Joi.alternatives().try(
      Joi.boolean(),
      Joi.object().keys({
        value: Joi.any(),
        actions: Joi.array().items(
          Joi.object().keys({
            action: Joi.string(),
            target: Joi.string(),
            as: Joi.string()
          })
        ),
        distinct: Joi.boolean()
      })
    )
  })
```

<o-tip type="note">Once you start using Joi for a property, all child properties must use Joi syntax.</o-tip>

## Using Joi as the schema

If you choose to use Joi for the schema, you will lose having orango's extended `required` and `default`
properties on `insert` and `update`. You can still achieve the same effect using hooks.

```js
const Joi = require('Joi')

// this was taken straight from Joi's example...
const schema = new orango.Schema(Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    role: Joi.string(),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
}).with('username', 'birthyear').without('password', 'access_token'))

MyModel.on(EVENTS.INSERT, model => {
  // simulating a required
  if(!model.username) {
    throw Error(`Missing required property "username"`)
  }
  if(!model.password) {
    throw Error(`Missing required property "password"`)
  }
  // simulating a default
  if(!model.role) {
    model.role = 'user'
  }
})
```

## Schema strict mode

A schema is `strict` by default. Strict schemas filter out any properties that
have not been defined in the schema. To relax this restriction, you can set `strict`
to `false` in the schema options. In the example, the schema will still validate
against known properties but no will no longer do anything with unknown properties.

```js
let schema = new orango.Schema({
  firstName: String,
  lastName: String
}, {
  strict: false
})

orango.model('User', schema)


// ...somewhere in code...
User.insert({
  firstName: 'John',
  lastName: 'Smith',
  role: 'admin' // will be inserted without any validation
})
```

## Defining a model with a class

The best way to add additional functionality to a model is by extending the class using `orango.createModel(schema:Schema)`.

<o-tip type="thumbs_down">You could do it this way by adding to the class and its prototype chain.</o-tip>

```js
let User = orango.model('User', schema)

User.newUser = function(firstName, lastName) {
  return new User({ firstName, lastName })
}

Object.defineProperty(User.prototype, "name", {
    get: function() {
      return this.firstName + ' ' + lastName
    }
})

User.prototype.toJSON = function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    name: this.name
  }
}
```

<o-tip type="thumbs_up">The prefered method is to use a <code>class</code> that extends orango's Model.</o-tip>

```js
const schema = new orango.Schema({
  firstName: String,
  lastName: String
})

const Model = orango.createModel(schema)

class Person extends Model {
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  static newPerson(firstName, lastName) {
    return new Person({
      firstName,
      lastName
    })
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      name: this.name
    }
  }
}

orango.model('Person', Person)
```

<o-tip type="code"><a href="https://github.com/roboncode/orango/blob/master/examples/snippets/register_model_with_a_class.js">Click here to see an code example</a></o-tip>

## Interacting with a model

Models contain a set of methods used to manipulate database documents. These 
methods can be chained together by the internal query builder. The last method called will return a `Promise`.

<o-tip>The best way to consume this promise is by using `async / await`.</o-tip>

Let's say you wanted to fetch users from the `users` collection in the database. To
fetch documents, you would call the `find()` method on your `User` model.

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
You need to request them. Use `return()` to get back the affected documents. By default, you will receive the results as an array,
since more than one document could be affected.

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
cast as models, use `model()` in the return statement.

```js
let user = await User.update({ active: false })
  .where({ email: 'john@gmail.com' }).limit(1)
  .return(orango.return.one().model())
```

## Querying without `await`

If you want to perform a query without waiting for a response use `exec()`.  Even though
`exec()` returns a promise the query will be executed, even if there are no handlers.
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
* **$ne** (not equal to)
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

## Converting JSON to models

It is possible to convert JSON to models using the `fromJSON()`
method on a Model class. It supports complex structures as well as arrays.

**Models can reference other models**

```js
let settingsSchema = new orango.Schema({
  language: String
})
orango.model('Settings', settingsSchema, false)

let userSchema = new orango.Schema({
  name: String,
  settings: 'Settings' // reference to another model
})
orango.model('User', userSchema)
```

**Convert JSON to model**

```js
let u = {
  name: "John Smith",
  settings: {
    language: "en_US",
  }
}

let user = User.fromJSON(u) // can pass in single object or an array of objects
console.log(user) // User { name: "John Smith", settings: Settings { language: "en_US" } }
```

<o-tip type="code"><a href="https://github.com/roboncode/orango/blob/master/examples/snippets/convert_to_model.js">See full example here</a></o-tip>

Visit the [Model API documentation](/api/model.md) to learn more about models.
