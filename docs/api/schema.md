---
pageClass: api
---

# Schema

The schema defines the blueprint for each model. ...

Orango's schemas are built using Tang and Joi libraries. 

[Joi](https://github.com/hapijs/joi) is an object schema description language and validator for JavaScript objects. In addition to
validation, it provides a flexible way of creating schemas for a wide variety of scenarios and is
easily extensible.


Tang is a library I built to extend Joi. At it's heart, Tang allows you to build Joi schemas using JSON-like structures.
Tang exists as a standalone validation tool, model generator and schema builder. It can be extended to build database-specific 
solutions such as this library for ArangoDB. It is capable of being used for other databases as well. Much of what you will
see in this section are features of Tang and Joi. To learn about all available validation properties, [refer to the Joi
API documentation](https://github.com/hapijs/joi).

## Getting started

Joi is a powerfull validation tool. if prefer, you can create Joi schemas directly in Orango. This example is taken directly from the front page of Joi Github.

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

const UserSchema = orango.schema(schema)
```

If you are not familiar with Joi, or are coming from Mongoose or just prefer to build using JSON, 
you can create a similar schema with Tang in Orango.

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

Both have their own advantages and disadvantages. Tang will allow you to create [scoped required properties](), but cannot provide you the full feature set of Joi. I would recommend that unless there is a feature in Joi that requires you to use Joi over Tang, then use the JSON notation. Also, you can mix and match Joi into the JSON notation.

Mixing the example above with Joi and Tang.
```js
const schema = {
  // scoped required property only required on create
  username: { type: String, alphanum: true, min: 3, max: 30, required: 'create' },
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
