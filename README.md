# <img alt="orango" src="https://dzwonsemrish7.cloudfront.net/items/2e201w2446332m0o2h2n/orango_logo.png" width="250px">


ArangoDB Object Modeling for Node.js, Foxx and Modern Web Browsers

Inspired by <a href="http://mongoosejs.com/">Mongoose</a>. 
Built using <a href="https://github.com/roboncode/tang">Tang</a>, <a href="https://github.com/hapijs/joi">Joi</a> and <a href="https://github.com/arangodb/arangojs">ArangoJS</a>

<a href="https://npmcharts.com/compare/orango?minimal=true"><img src="https://img.shields.io/npm/dm/orango.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/v/orango.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/orango"><img src="https://img.shields.io/npm/l/orango.svg" alt="License"></a>
  [![Build Status](https://travis-ci.com/roboncode/orango.svg?branch=master)](https://travis-ci.com/roboncode/orango)
[![Coverage Status](https://coveralls.io/repos/github/roboncode/orango/badge.svg?branch=master)](https://coveralls.io/github/roboncode/orango?branch=master)  

**Orango** is an Object Data Modeler (ODM) that provides the following features: (**Draft**)

* Central connectivity to ArangoDB
* Automated creation of databases, collections and indexing
* Ability to pre-populate database with data
* and more...

### Why use an ODM? (*Draft*)

* Ease of use
* Focus on data instead of queries
* Optimized queries
* Validation prevent bad data from being injected into database
* Cleaner interfaces
* Single point of change for bug fixes, features, etc
* Computed properties on return values
* Default values for missing values

### Documentation

Official documentation can be found at **[orango.js.org](https://orango.js.org)**. (*Work in progress and yes, I know, there is very little*)

### Project Status
**I started Orango at the beginning of August 2018**. This project is in `pre-release` and the API is subject to change as functionality and workflow is being developed. Once the dust settles, I will move it into an `alpha`.

**[14 Nov 2018]** Status update. I am currently working on a few feature items I found were needed when testing in real-world scenarios.

* Support for `scoped required properties`. This will allow you to create schemas that required different properties depending on whether you are creating or updating values. This is probably how it will look once completed...

```js
new Schema({
	name: { type: String, required: true }, // always required
	email: { type: String, required: 'create update' }, // same as true
	created: { type: Date, required: 'create' }, // only on create
	updated: { type: Date, required: 'update' }, // only on update
})
```

* Support for `scoped default properties`. This one is a bit trickier but researching it out. If I can get it working it will look like this...

```js
new Schema({
	created: { type: Date, default: { create: Date.now } }, // only on create
	updated: { type: Date, default: { update: Date.now } }, // only on update
})
```
**[19 Oct 2018]** 0.9.4 released. Bug fixes. Updates to examples (still in progress). To get the example up and running, refer to the examples `README.md`. The server's controllers and models directories and `app.js` are where Orango is defined and used.

**[08 Oct 2018]** 0.9.3 released. Added authentication for connecting to database. Ability to create new databases with authenticated user. I worked on Edge collections and models and now provide a more streamlined approach with link() and unlink(). Many updates to the examples/server. Working on creating a mock twitter application. Other bug fixes.

*Screenshot of example application (in progress)*

<img src="https://duaw26jehqd4r.cloudfront.net/items/2y2D202N1n3J3Z1M170s/Image%202018-10-10%20at%209.13.28%20AM.png" width="150">


**[03 Oct 2018]** 0.9.0 released. A second iteration of `populate()` is available. In addition, `var()`, `append()` and `merge()` were added. The documentation and examples are really lacking at this point. I am still working on examples and then documentation will follow after the API feels a little less ephemeral. I would not recommend using Orango yet for any real development until I have completed the examples to test the workflow. I am still finding some parts that are missing / or needing refactoring as I am trying to use it.

**[26 Sep 2018]** I am working on fixing the current issues and and continuing on example project. There is quite a bit of refactoring in the latest commits and API changes as the workflow is being evaluated.

**[19 Sept 2018]**  On vacation, thx for the feedback. I will be at it again once I am back.

**[10 Sept 2018]**  I am currently working on an example project. The [example](https://github.com/roboncode/orango/tree/examples) branch will provide an initial use case in a "real-world" application using Express. It also allows me to find missing workflows that are needed for an initial release. One of those features coming down the pipeline is `populate()` - which provides the ability to populate properties from other collections when fetching data.

**[04 Sept 2018]**  I have tests in place currently at [![Coverage Status](https://coveralls.io/repos/github/roboncode/orango/badge.svg?branch=master)](https://coveralls.io/github/roboncode/orango?branch=master)  . I am testing out the API workflow on a test project and then I will working on the documentation. In the meantime, if you are eager to start using Orango, I would recommend looking at the test cases for examples. There are other items on the Roadmap but I am working on a stable 1.0 release

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
* Pre and post events
* Real-joins (thanks ArangoDB!)
* Custom queries
* Filtering unknown properties
* Support for Joi syntax

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

User.statics.findByEmail = async function(email) {
	return this.findOne({ email })
}

// computed property
User.computed.name = function() {
	return this.firstName + ' ' + this.lastName
}

orango.model('user', User)

// ... in code somewhere else ... //

let user = async User
	.findByEmail('roboncode+orango@gmail.com')
	.computed(true)
	
console.log('Hello,', user.name)
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
You can also `findOne`, `findById`, `findByQuery`, `updateOne`, etc. For more details check out [the docs](#).

**Important!** If you opened a separate connection using `orango.get('anotherNameBesidesDefault')` but attempt to access the model through `orango.model('ModelName')` it will not work as expected since it is not hooked up to the active db connection. In this case access your model through the connection you created:

```js
const example = orango.get('example')
example.connect()
const MyModel = example.model('ModelName', schema)
const m = new MyModel()
m.save() // works
```

--vs--

```js
const example = orango.get('example')
example.connect()
example.model('ModelName', schema)

// will not be found because it it was not registered with this instance
const MyModel = orango.model('ModelName')
const m = new MyModel()
m.save()
```

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
* Print as AQL
* Performance measurements on data conversion
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

# Known Issues / Limitations

* `required: true` in the schema forces key/values to be present in updates

# Roadmap

### Features
* <del>Support database users</del>
* autoIndex in schema - will create indexes as properties become part of query
* Getter / Setters in schema
* <del>Pre / Post Interceptors</del>
* Support upsert option
* Integrate [Arango Chair](https://www.arangodb.com/2017/03/arangochair-tool-listening-changes-arangodb/)
* web browser compatible
* Better error handler / dispatching

### Fixes
* Check / Change name that references setDefaultsToNull, API change needed - withDefaults option, etc
* Fix up for loops to be async
* Break out all errors into constants

### Other
* Cleanup
* Add lint support

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
