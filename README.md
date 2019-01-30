# <img alt="orango" src="docs/images/orango_logo.png" width="400px">


ArangoDB Object Modeling for Node.js, Foxx and Modern Web Browsers

<a href="https://npmcharts.com/compare/orango?minimal=true"><img src="https://img.shields.io/npm/dm/orango.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/v/orango.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/l/orango.svg" alt="License"></a>
  [![Build Status](https://travis-ci.com/roboncode/orango.svg?branch=master)](https://travis-ci.com/roboncode/orango)
[![Coverage Status](https://coveralls.io/repos/github/roboncode/orango/badge.svg?branch=master)](https://coveralls.io/github/roboncode/orango?branch=master)  

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

### Community Support 

<a href="https://discord.gg/7fHadJj"><img src="docs/images/discord.svg" alt="Join the Orango community" width="300"></a>

### Documentation & Articles

Official documentation can be found at **[orango.js.org](https://orango.js.org)**.

I will be regularly posting articles on CodeBurst.io (Medium). Follow me there https://codeburst.io/@roboncode

Follow me on Twitter https://twitter.com/@roboncode for updates

### Examples

A growing set of examples are available [here](examples). 

### Installation

First be sure you have ArangoDB and Node.js installed. You can easily install ArangoDB using the [official docker container](https://hub.docker.com/r/arangodb/arangodb/). There is also a `docker-compose.yml` file that is in the `tools` directory if you want to copy it to your project, then all you have to do is run the code below to start an instance of ArangoDB.

```cmd
$ docker-compose up -d
```

Next, install Orango from the command line using `npm`:

```cmd
$ npm install orango@next
```

### Importing

```js
// Using Node.js `require()`
const orango = require('orango')

// Using ES6 imports
import orango from 'orango'
```

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
const schema = new orango.Schema({
  author: String,
  title: String,
  body: String,
  date: Date
})

orango.model('Blog', schema)
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
const { SCHEMA } = const.consts
  
class UserSchema extends orango.Schema {
  // computed properties
  get fullName() {
    return (this.firstName + ' ' + this.lastName).trim()
  }
}

let schema = new UserSchema({
  firstName: String,
  lastName: String,
  // Joi can be used directly
  email: Joi.string().email(),
  // JSON gets converted to Joi data types automatically
  age: { type: Number, min: 18 },
  bio: { type: String, regex: /[a-z]/ },
  // default values are supported on insert and update
  created: { type: Date, default: Date.now }
})

schema.addIndex(SCHEMA.INDEX.HASH, 'email)
schema.addIndex(SCHEMA.INDEX.SKIP_LIST, ['firstName', 'lastName'])

let User = orango.model('User', schema)

// extend your model with custom functions
User.findByEmail = async function(email) {
  return await this.find().one().where({ email })
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

#### MIT License

This library is under the MIT license. [See LICENSE](LICENSE)