---
pageClass: api
---

# Schema

## Overview

Schemas define the structure, properties and rules for a model. They also define a collections indexed properties. Schemas are used to perform validation and filter out unknown properties ensuring the database only contains valid data you have defined.

**Simple usage example**

```js
class User extends orango.Model {
  constructor(data) {
    super(data, User.schema)
  }
}

User.schema = orango.schema({
  firstName: String,
  lastName: String
}, {
  indexes: [
    { type: 'hash', fields: ['firstName', 'lastName'] }
  ]
})
```

The schema is has two parts:

1. An object that defines valid properties, types and requirements
2. An *optional* sencond object that defines indexes that should exist in the ArangoDB collection.

## Schema definitions

Schema definitions are built using [Tang](https://github.com/roboncode/tang) and [Joi](https://github.com/hapijs/joi) libraries. Tang allows you to build Joi descriptions using JSON.

Joi is an object schema description language and validator for JavaScript objects. In addition to
validation, it provides a flexible way of creating schemas for a wide variety of scenarios and is
easily extensible.  To learn about all available validation properties, [refer to the Joi
API documentation](https://github.com/hapijs/joi).

Defining your schema can be done several different ways...

```js
// Type definition only
orango.schema({
  firstName: String
})

// Type definition in object
orango.schema({
  firstName: {
    type: String
  }
})

// Joi definition
orango.schema({
  firstName: Joi.string()
})
```

## Schema rules

You can implement schemas with rules such as min, max, regex, etc. Once again look at Joi for options.

```js
orango.schema({
  firstName: { type: String, min: 1, max: 15 },
  lastName: { type: String, min: 1, max: 15 },
  email: { type: String, email: { minDomainAtoms: 2 } },
})
```

## Using Joi

Even though it is recommended to use JSON when creating schemas, if you have complex rules, you can
alterntatively use Joi for some or all of the schema definition. Let's look at how you can use Joi
and how you can use a hybrid of JSON and Joi.

> This example comes straight from Joi's `readme.md` in Github.

### Joi implementation

```js
const schema = Joi.object()
  .keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [ Joi.string(), Joi.number() ],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
  })
  .with('username', 'birthyear')
  .without('password', 'access_token')

User.schema = orango.schema(schema)
```

### JSON sprinkled with Joi

If you are not familiar with Joi, coming from Mongoose or just prefer to build using JSON, 
you can create a similar schema with JSON.

```js
const schema = {
  username: { type: String, alphanum: true, min: 3, max: 30, required: true },
  password: { type: String, regex: /^[a-zA-Z0-9]{3,30}$/ },
  access_token: { type: [ String, Number ] },
  birthyear: { type: Number, integer: true, min: 1900, max: 2018 },
  email: { type: String, email: { minDomainAtoms: 2 } }
}

const UserSchema = orango.schema(schema)
UserSchema.joi = UserSchema.joi
  .with('username', 'birthyear')
  .without('password', 'access_token')
```

### Mixing the example above with Joi and JSON.
```js
const schema = {
  // scoped required property only required on create
  username: { type: String, alphanum: true, min: 3, max: 30, required: 'insert' },
  // Joi inserted into Tang
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  // scoped required property required on update
  access_token: { type: [ String, Number ], required: 'update' },
  // birthyear is required on create because of with() below
  birthyear: { type: Number, integer: true, min: 1900, max: 2018 },
  // scoped required property required on create
  email: { type: String, email: { minDomainAtoms: 2 }, required: 'create' }
}

const UserSchema = orango.schema(schema)
UserSchema.joi = UserSchema.joi
  .with('username', 'birthyear')
  .without('password', 'access_token')
```

## Scoped required properties

The JSON notation has some advantages Joi does not provide. You can create `scoped required properties`.
Let's look at some examples with explanations.

```js
User.schema = orango.schema({
  email: { type: String, required: true } // required on inserts and updates
})

User.schema = orango.schema({
  email: { type: String, required: 'insert' } // required only on inserts
})

User.schema = orango.schema({
  email: { type: String, required: 'update' } // required only on updates
})
```

## Strict mode

By default, Orango enables a strict mode which filters out undefined properties. If you wish to have the schema allow for unknown properties, set `strict` to `false`.

```js
const { SCHEMA } = orango.consts

User.schema = orango.schema({
  firstName: String,
  lastName: String,
  email: String
}, {
  strict: false
})
```

## Indexing

You can define indexes for your collections in the second parameter of the schema function.

```js
const { SCHEMA } = orango.consts

User.schema = orango.schema({
  firstName: String,
  lastName: String,
  email: String
}, {
  indexes: [
    {
      type: SCHEMA.INDEX.HASH,
      fields: ['email']
    }
  ]
})
```

Index is an array in the options object. The following indexes are supported. ArangoDB documentation can be found here regarding each indexing type: [https://docs.arangodb.com/devel/Drivers/JS/Reference/Collection/Indexes.html](https://docs.arangodb.com/devel/Drivers/JS/Reference/Collection/Indexes.html)

For any ArangoDB Index type which also accepts "unique", "sparse", and/or "deduplicate" options, these values default to "false", with the exception of "deduplicate", which defaults to "true."

You can provide an additional `opt` key in your index object, with a nested object that specifies those boolean key/value pairs. They will get passed during collection & index creation.

#### Hash

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String]
}
```

#### Hash example with all supported options

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String],
  opts: { sparse: false, unique: true, deduplicate: true},
}
```

#### Skip list

```js
{
  type: SCHEMA.INDEX.SKIP_LIST,
  fields: [String]
}
```

#### Skip list example with all supported options

```js
{
  type: SCHEMA.INDEX.SKIP_LIST,
  fields: [String],
  opts: { sparse: false, unique: true, deduplicate: true},
}
```

#### Geo

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String]
}
```

#### Fulltext 

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String],
  minLength: Number
}
```

#### Persistent

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String]
}
```

#### Persistent example with all supported options

```js
{
  type: SCHEMA.INDEX.HASH,
  fields: [String],
  opts: { sparse: false, unique: true },
}
```
