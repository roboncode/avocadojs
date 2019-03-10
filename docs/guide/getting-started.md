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
* Clean interfaces
* Single point of change for bug fixes, features, etc
* Save on redundancy - DRY implementation
* Required and default values
* and more...

> The goal of this library is to perform common tasks while still leaving the developer in control of their data.

### Official Documentation

Official documentation can be found here **[orango.js.org](https://orango.js.org)**.

<!-- I also will be regularly posting articles on CodeBurst.io (Medium). Follow me (@roboncode) there [https://codeburst.io/@roboncode](https://codeburst.io/@roboncode) -->

<!-- You can also follow me on Twitter [https://twitter.com/@roboncode](https://twitter.com/@roboncode) for updates -->

### Community Support

<a href="https://discord.gg/7fHadJj"><img src="/discord.svg" alt="Join the Orango community" width="300"></a>

### Examples

A growing set of examples are available [here](https://github.com/roboncode/orango/tree/master/examples). 

## Overview

### Connecting to ArangoDB

To connect to ArangoDB, we need to create a connections. 

**Connecting to the default `_system` database**

```js
orango.connect():Promise
// You can also use...
orango.get().connect():Promise
```

**To connect to a custom database**

```js
orango.get('my_database').connect():Promise
```

#### Usage

<o-tip /> The best way to use `connect()` is by using `async / await`.

```js
const orango = require('orango')
const { EVENTS } = orango.consts
const db = orango.get('example')

// we are connected, but orango has not initialized the models
db.events.once(EVENTS.CONNECTED, conn => {
   console.log('🥑  Connected to ArangoDB:', conn.url + '/' + conn.name)
})

// everything is initialized and we are ready to go
db.events.once(EVENTS.READY, () => {
   console.log('🍊  Orango is ready!')
})

function registerModels(orango) {
  // ... register models somewhere ...
}

async function main() {
  try {
    registerModels(db)

    await db.connect({
      username: 'root',
      password: 'orango'
  })
    // everything is initialized and we are ready to go
    console.log('Are we connected?', db.connection.connected) // true
  } catch(e) {
    console.log('Error:', e.message)
  }
}

main()
```

> Orango buffers model definitions, so they can be defined before or after a connection is established.

### Defining a Model

Model allows you to define your data and interact with ArangoDB using a simple API.

**Defining a model**

<o-tip /> Orango uses the Joi library to define and validate data.

```js
module.exports = orango => {

  const schema = new orango.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },,
    body: { type: String, required: true },,
    tags: [String],
    settings: {
      scope: { 
        type: String, 
        allow: ["draft", "private", "public"], 
        default: "draft" 
      }
    },
    created: { type: Date, default: Date.now },
    released: Date,
  })

  return orango.model('Post', schema)
}
```

**Using a model**

```js
let Post = orango.model("Post")

let post = new Post({
  author: "Rob Taylor",
  title: "My first post"
  body: "This is my first post."
  tags: ["orango", "example"]
})

post.save()
```