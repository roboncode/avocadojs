# <img alt="orango" src="https://dzwonsemrish7.cloudfront.net/items/2e201w2446332m0o2h2n/orango_logo.png" width="250px">


ArangoDB Object Modeling for Node.js, Foxx and Modern Web Browsers

Inspired by <a href="http://mongoosejs.com/">Mongoose</a>. 
Built using <a href="https://github.com/roboncode/tang">Tang</a>, <a href="https://github.com/hapijs/joi">Joi</a> and <a href="https://github.com/arangodb/arangojs">ArangoJS</a>

<a href="https://npmcharts.com/compare/orango?minimal=true"><img src="https://img.shields.io/npm/dm/orango.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/v/orango.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/l/orango.svg" alt="License"></a>
  [![Build Status](https://travis-ci.com/roboncode/orango.svg?branch=master)](https://travis-ci.com/roboncode/orango)
[![Coverage Status](https://coveralls.io/repos/github/roboncode/orango/badge.svg?branch=master)](https://coveralls.io/github/roboncode/orango?branch=master)  

**Orango** is an Object Data Modeler (ODM) that provides the following features:

* Central connectivity to ArangoDB
* Automated creation of collections and indexes
* Create schemas for data
* Interact with models to handle data-centric functionality
* Pre-populate database
* and more...

### Why use an ODM?

* Ease of use
* Model-driven data
* Focus on data instead of queries
* Optimized query creation
* Validation prevents bad data from being injected into database
* Cleaner interfaces
* Single point of change for bug fixes, features, etc
* Computed properties on return values
* Default values
* and more...

### Documentation

**(In Progress)** Official documentation can be found at **[orango.js.org](https://orango.js.org)**.

### Project Status

Orango is in `alpha`. Working on bug fixes, cleanup, documentation and examples.

### Installation

First be sure you have ArangoDB and Node.js installed. You can easily install ArangoDB using the [official docker container](https://hub.docker.com/r/arangodb/arangodb/). There is also a `docker-compose.yml` file that is in the `tools` directory if you want to copy it to your project, then all you have to do is run the code below to start an instance of ArangoDB.

```cmd
$ docker-compose up -d
```

Next, install Orango from the command line using `npm`:

```cmd
$ npm install orango
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

First, we need to define a connection. If your app uses only one database, you should use `orango.connect()`. If you need to create additional connections, use `orango.get( instanceName:String ).connect()`.

The method `connect(db:String="_system", [{url:String="http://localhost:8529", username:String, password:String}])` takes database name with options to establish a connection. Otherwise, it will use the default values.

```js
const orango = require('orango')

orango.events.on('connected', () => {
  console.log('Orango is connected!')
})

async function main() {
   await orango.connect()
}

main()
```

> Orango buffers model definitions, so they can be defined before or after a connection is established.

### Defining a Model

```js
const BlogPost = orango.Schema({
	author: String,
	title: String,
	body: String,
	date: Date	
})

orango.model('blog', BlogPost)
```
Aside from defining the structure of your documents and data types, a Schema handles the definition of:

* Validators
* Default values
* Indexes
* Middleware
* Methods definitions
* Statics definitions
* Computed properties
* Pre and post hooks
* Real-joins (thanks ArangoDB!)
* Custom queries
* Filtering out unknown properties
* Joi syntax support

The following example shows some of these features:

```js
const orango = require('orango')
const Joi = require('joi')
const { HOOKS } = orango.CONSTS

const UserSchema = orango.Schema({
	firstName: String,
	lastName: String,
	email: Joi.string().email(), // Joi can be used directly
	age: { type: Number, min: 18 }, // JSON gets converted to Joi data types automatically
	bio: { type: String, regex: /[a-z]/ },
	updatedAt: Date
}, {
	strict: true, // properties not defined will be filtered out
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

// static methods
UserSchema.statics.findByEmail = async function(email) {
	return this.findOne({ email })
}

// computed properties
UserSchema.computed.name = function() {
	return this.firstName + ' ' + this.lastName
}

// hooks
UserSchema.on(HOOKS.UPDATE, payload => {
	payload.data.updatedAt = Date.now()
})



orango.model('User', UserSchema)

// ... in code somewhere else ... //

let user = async User
	.findByEmail('john.smith@gmail.com')
	.computed(true)
	
console.log('Hello,', user.name)
```

# Documentation

Go to https://orango.js.org for detailed documentation and tutorials.

# Examples

A growing set of examples are available [here](examples/snippets). 

# Roadmap

### Current

* Create a proper CHANGELOG
* Bug fixes
* Documentation
* Examples

### Future
* autoIndex in schema - will create indexes as properties become part of query
* Support upsert option
* Getter / Setters in schema
* Integrate [Arango Chair](https://www.arangodb.com/2017/03/arangochair-tool-listening-changes-arangodb/)
* web browser compatible
* Better error handler / dispatching
* Upgrade to TypeScript
* Add lint support

## MIT License

This library is under the MIT license. [See LICENSE](LICENSE)