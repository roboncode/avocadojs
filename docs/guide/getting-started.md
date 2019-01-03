# Getting Started

### Welcome to Orango!

**Orango** is an **ODM** (Object Data Modeler), an **ORM** (Object Relational Mapper) and an **OGM** (Object Graphical Mapper) in one that provides the following features:

* Central connectivity to ArangoDB
* Automated creation of collections and indexes
* Create schemas for data
* Interact with models to handle data-centric functionality
* Pre-populate database
* Graph linking and querying
* and more...

### Why use Orango with ArangoDB?

* Ease of use
* Model-driven data
* Focus on data instead of queries
* Optimized query creation
* Validation
* Filter unknown data from being injected into database
* Cleaner interfaces
* Single point of change for bug fixes, features, etc
* Save on redundancy - DRY implementation
* Default values
* and more...

### Official Documentation & Updates

Official documentation can be found at **[orango.js.org](https://orango.js.org)**.

I also will be regularly posting articles on CodeBurst.io (Medium). Follow me (@roboncode) there [https://codeburst.io/@roboncode](https://codeburst.io/@roboncode)

You can also follow me on Twitter [https://twitter.com/@roboncode](https://twitter.com/@roboncode) for updates

### Examples

A growing set of examples are available [here](examples). 

## Overview

### Connecting to ArangoDB

First, we need to define a connection. If your app uses the default `_system` database, you can connect using `orango.connect()`. If you need to create additional connections, use `orango.get( database:String ).connect()`.

The method `connect([{url:String="http://localhost:8529", username:String, password:String}])` takes database name with options to establish a connection. Otherwise, it will use the default values.

```js
const orango = require('orango')
const { EVENTS } = orango.consts

orango.events.on(EVENTS.READY, () => {
  console.log('Orango is ready!')
})

async function main() {
   await orango.connect()
}

main()
```

> Orango buffers model definitions, so they can be defined before or after a connection is established.

### Defining a Model

```js
module.exports = orango => {

  class BlogPost extends orango.Model {
    constructor(data) {
      super(data, BlogPost.schema)
    }
  }

  BlogPost.schema = orango.schema({
    author: String,
    title: String,
    body: String,
    date: Date
  })

  return orango.model('blog', BlogPost)
  
}
```
Aside from defining the structure of your documents and data types, Orango models can handle the definition of:

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

The following example shows some of these features:

```js
const Joi = require('joi')
  
module.exports = orango => {

  class User extends orango.Model {
    constructor(data) {
      super(data, User.schema)
    }

    // static methods
    static async findByEmail = async function(email) {
      return await this.find().one().where({ email })
    }

    // computed properties
    get name = function() {
      return this.firstName + ' ' + this.lastName
    }

    // custom return object
    toJSON() {
      return Object.assign({}, this, { name: this.name })
    }
  }

  User.schema = orango.schema({
    firstName: String,
    lastName: String,
    email: Joi.string().email(), // Joi can be used directly
    age: { type: Number, min: 18 }, // JSON gets converted to Joi data types automatically
    bio: { type: String, regex: /[a-z]/ },
    updatedAt: Date
  }, {
    indexes: [ // create indexes for items we will query against
      {
        type: 'hash',
        fields: ['email']
      },
      {
        type: 'skipList',
        fields: ['firstName']
      },
      {
        type: 'skipList',
        fields: ['lastName']
      }
    ]
  })

  // hooks
  User.hooks = {
    update(model) {
      model.updatedAt = Date.now()  
    }
  }

  orango.model('User', User)

}
```

**In code somewhere else**

```js
const User = orango.model('User')

...

let rawData = await User.findByEmail('john.smith@gmail.com')
let user = User.fromJSON(rawData) // convert result to model
console.log('Hello,', user.name) // access model getter
```
