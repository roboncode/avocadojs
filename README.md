# <img alt="orango" src="https://dzwonsemrish7.cloudfront.net/items/2e201w2446332m0o2h2n/orango_logo.png" width="250px">


ArangoDB Object Modeling for Node.js, Foxx and Modern Web Browsers

Inspired by <a href="http://mongoosejs.com/">Mongoose</a>. 
Built using <a href="https://github.com/roboncode/tang">Tang</a>, <a href="https://github.com/hapijs/joi">Joi</a> and <a href="https://github.com/arangodb/arangojs">ArangoJS</a>

[![NPM version](https://badge.fury.io/js/orango.svg)](http://badge.fury.io/js/orango)
[![Build Status](https://travis-ci.com/roboncode/orango.svg?branch=master)](https://travis-ci.com/roboncode/orango)

[![npm](https://nodei.co/npm/orango.png)](https://www.npmjs.com/package/orango)

**Orango** is the library built on top of Tang. It uses ArangoJS to interface with the [ArangoDB](https://www.arangodb.com/). It provides the following features:

* Central connectivity to ArangoDB
* Automated creation of databases, collections and indexing
* Ability to pre-populate database with data
* and more...

### Documentation

[orangojs.com](https://orangojs.com)

### Project Status
**Orango** is currently **in development** and **should not be used in a production environment** until it has been completed.

### Installation
First be sure you have ArangoDB and Node.js installed. You can easly install ArangoDB using the [official docker container](https://hub.docker.com/r/arangodb/arangodb/). There is also a docker-compose.yml file that is in the root of this project if you want to copy it to your project, then all you have to do is run

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

First, we need to define a connection. If your app uses only one database, you should use `orango.connect()`. If you need to create additional connections, use `orango.getInstance( instanceName:String ).connect()`.

The method `connect(url:String="http://localhost:8529", db:String="_system")` takes the url string and database name to establish a connection. Otherwise, it will use the default values.

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
* Defaults
* Getters
* Setters
* Indexes
* Middleware
* Methods definitions
* Statics definitions
* Computed properties
* Plugins
* Real-joins (thanks ArangoDB!)

The following example shows some of these features:

```js
const orango = require('orango')
const Joi = require('joi')

const User = orango.Schema({
	firstName: String,
	lastName: String,
	email: Joi.string().email(), // Joi can be used directly
	age: { type: Number, min: 18 }, // JSON gets converted to Joi data types automatically
	bio: { type: String, regex: /[a-z]/ },
	updated: { type: Date, default: Date.now }
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

// computed property
User.computed.name = function() {
	return this.firstName + ' ' + this.lastName
}

orango.model('user', User)
```

### Accessing a Model

Once we define a model through `orango.model('ModelName', mySchema)`, we can access it through the same function

```js
const MyModel = orango.model('ModelName')
```

Or just do it all at once

```js
const MyModel = orango.model('ModelName', mySchema)
```
The first argument is the singular name of the collection your model is for. **Orango automatically looks for the plural version of your model name.** For example, if you use

```js
const MyModel = orango.model('Ticket', mySchema);
```

Then Orango will create the model for your **tickets** collection, not your **ticket** collection.

Once we have our model, we can then instantiate it, and save it:

```js
const instance = new MyModel();
instance.my.key = 'hello';
instance.save()
```

Or we can find documents from the same collection

```js
let docs = await MyModel.find()
```
You can also `findOne`, `findById`, `findByQuery`, `update`, etc. For more details check out [the docs](#).

**Important!** If you opened a separate connection using `orango.getInstance('anotherNameBesidesDefault')` but attempt to access the model through `orango.model('ModelName')` it will not work as expected since it is not hooked up to the active db connection. In this case access your model through the connection you created:

```js
const example = orango.getInstance('example')
example.connect()
const MyModel = example.model('ModelName', schema)
const m = new MyModel()
m.save() // works
```

--vs--

```js
const example = orango.getInstance('example')
example.connect()
example.model('ModelName', schema)

// will not be found because it it was not registered with this instance
const MyModel = orango.model('ModelName')
const m = new MyModel()
m.save()
```

#### Tang Data Modeler

The data modeler allows you to register models.

Tang is a data modeler. It allows you to build schemas and models in a simplified JSON structure and apply those schemas against your data. It is I/O agnostic. It is a high-scaled version of the Joi API.

Tang also has a builder which can call built-in and custom functions to manipulate data in an asynchronous and optimized manner.

**Example of defining a model**

```js
let schema = new Schema(...)
module.exports = orango.model('User', schema)
```

### Model has many built-in query methods

* setConnection
* find
* findByEdge
* findById
* findByIdAndDelete
* findByIdAndUpdate
* findByQuery
* findMany
* updateOne
* deleteOne
* deleteMany
* findOne
* deleteMany
* findOne
* getCollection
* importMany
* updateMany
* remove
* save
	
### Supports additional cool features like:

* Conditional "$or" statements in query
* Automatic removal of default values
* Strict schemas which automatically strips unknown properties
* Simple incrementation of values using "++/--" or "$inc"
* Simple sorting using using strings
* Simple return value filtering
* Ability to print AQL during execution (with support to prettify and colorize)
* Performance measurments on data conversion
* and more...



### ORM for common query functions for document retrieval and modification

* toAQL: returns the AQL string version of query
* action(find | findEdge | update | delete)
* collection
* computed
* connection
* criteria
* data
* exec
* limit
* model
* offset
* options
* query
* schemaOptions
* select
* sort

### Schema using Tang - Build schema with JSON structure and/or Joi
  

## Roadmap

### Features
* autoIndex in schema - will create indexes as properties become part of query
* Getter / Setters in schema
* Events
* Pre / Post Interceptors

### Fixes
* Check / Change name that references setDefaultsToNull, API change needed - withDefaults option, etc
* Fix up for loops to be async
* Break out Tang into separate repo
* criteriaBuilder array support

### Other
* unit tests (in progress) - 100+ and counting
* cleanup
* more documentation
* web browser compatible
* create document website for orangojs.com
* add lint

## MIT License

Copyright (c) 2018 RobOnCode &lt;roboncode+orango@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
