# AvocadoJS

### *** In Development ***

ArangoSlice is a JavaScript Object Modeler for Node.js. 

Inspired by [Mongoose](http://mongoosejs.com/). 
Built using [Avocado](https://github.com/roboncode/avocadojs), [Joi](https://github.com/hapijs/joi) and [ArangoJS](https://github.com/arangodb/arangojs)

I really like [Mongoose](http://mongoosejs.com/) for [MongoDB](https://www.mongodb.com/) and I wanted something similar to it for [ArangoDB](https://www.arangodb.com/).


<!-- <img src="https://image.flaticon.com/icons/svg/835/835420.svg" width="150px"> -->

## Quick Start

### Run Docker ArangoDB

```
docker-compose up -d
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

### What is Avocado?

Avocado provides a these specific features:

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

	* findMany
	* updateOne
	* deleteOne
	* find
	* findByEdge
	* findById
	* findByIdAndDelete
	* findByIdAndUpdate
	* findByQuery
	* deleteMany
	* findOne
	* deleteMany
	* findOne
	* getCollection
	* importMany
	* updateMany
	* remove
	* save
	* setConnection
	
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
* unit tests (in progress)
* cleanup
* more documentation
* web browser compatible