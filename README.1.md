<div style="margin-top:-50px;display:flex;align-items:center">
	<img src="https://dzwonsemrish7.cloudfront.net/items/3s2k2E3b053t1Q2A0G20/orango.png" height="100px" style="margin-right:15px">
	<div style="padding-top: 72px">
		<div style="line-height:60px;font-size:48px;font-weight:bold">Orango</div>
		<div>ArangoDB Object Modeling for Node.js, Foxx and Modern Web Browsers</div>
		<div>Inspired by <a href="http://mongoosejs.com/">Mongoose</a>. 
Built using <a href="https://github.com/roboncode/tang">Tang</a>, <a href="https://github.com/hapijs/joi">Joi</a> and <a href="https://github.com/arangodb/arangojs">ArangoJS</a></div>
	</div>
</div>	

### Quick Start

First be sure you have ArangoDB and Node.js installed.

Next, install Orango from the command line using `npm`:

```cmd
$ npm install orango
```

### Run Demo

Running the demo will:

- Create a database named "demo"
- Create several collections with the appropriate indexes
- Populate the collections with mock data
- Perform queries on the data with different built in and custom methods

```
node demo
```

### What is Tang?

Tang is an database agnostic Object Modeling and validator. Orango is built on top of Tang but it can also be used independently by providing these features:

* Schema Creator
* Model Creator
* Validation
* Supports computed properties, static and instance methods
* Centralized Event Dispatcher
* Builder to modify data in effecient manner
* Helper functions for common data manipulation

#### Avocado Schema Creator

The schema creator allows you to build schemas for your data. It is just a JSON version of the [Joi library](https://github.com/hapijs/joi). It has the advantage of building quick schemas. It also supports adding a Joi schema directly into the JSON structure as well.

**Simple user schema example**

```js
let schema = arango.Schema({
  role: { type: String, valid: ['admin', 'user'], default: 'user' },
  screenName: String,
  firstName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 },
  lastName: { type: String, regex: /^[A-Za-z\s']+$/, min: 3 ,
  email: { type: String, email: {/* no options needed */}, required: true },
  updatedAt: Date
})

schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

schema.statics.sayGoodbye = function() {
  this.emitter.emit('sayGoodbye')
}

schema.methods.sayHello = function(day) {
  this.emitter.emit('sayHello', day, this.firstName + ' ' + this.lastName)
}
```
#### Avocado Data Modeler

The data modeler allows you to register models.

Avocado is a data modeler. It allows you to build schemas and models in a simplified JSON structure and apply those schemas against your data. It is I/O agnostic. It is a high-scaled version of the Joi API.

Avocado also has a builder which can call built-in and custom functions to manipulate data in an asynchronous and optimized manner.

**Example of defining a model**

```js
let schema = new Schema(...)
module.exports = arango.model('User', schema)
```

### What are slices?

Slices extend Avocado in order to provide I/O to various sources. These might be databases, local file access, services, etc. The first and primary slice being developed is for ArangoDb.

#### Arango Slice

**Arango Slice** is the library built on top of Avacado. It uses ArangoJS to interface with the [ArangoDB](https://www.arangodb.com/). It provides the following features:

* Central connectivity to ArangoDB
* Automated creation of databases, collections and indexing
* Ability to pre-populate database with data

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

### Schema using Avocado - Build schema with JSON structure and/or Joi
  

## Roadmap
* Stick with ArangoSlice or call it something else?
* Break out ArangoSlice from Avocado
* unit tests (in progress) - 85 so far
* cleanup
* more documentation
* web browser compatible