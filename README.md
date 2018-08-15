# AvocadoJS

ArangoDB is a JavaScript object modeling for web browsers and Node.js. No matter how you slice it, its all good!

<img src="https://image.flaticon.com/icons/svg/835/835420.svg" width="150px">

Inspired by [Mongoose](http://mongoosejs.com/). 
Built using [Joi](https://github.com/hapijs/joi) and [ArangoJS](https://github.com/arangodb/arangojs)

# *** In Development ***
## Roadmap
* unit tests (in progress)
* cleanup
* more documentation

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

I really like [Mongoose](http://mongoosejs.com/) for MongoDB and I wanted something similar to it for ArangoDB. If you haven't tried out ArangoDB, I suggest you check it out! https://www.arangodb.com

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
* Ability to populate database with sample data
* Common query functions for document retrieval and modification
  
  * findById
  * findOne
  * findMany
  * find
  * save (create or update)
  * findByIdAndUpdate
  * updateOne
  * updateMany
  * findByIdAndDelete
  * deleteOne
  * deleteMany
  * query
  * importMany

## Miscellaneous

Supports
  * sorting() - return docs in sorting order and direction
  * select() - return selected properties back

### Does Avocado do everything Mongoose does?

Nope.

### Will Avocado eventually do everything Mongoose does?

Nope. Avocado is meant to be agile. You need something, add it to your project. If you feel others will benefit from something you have added, fork this repo and issue a pull requrest. I didn't want to over-engineer this library. This reduces bugs, support and limiting how it can be used.

