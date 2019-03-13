---
pageClass: api
---

# Constants

A list of constants used in Orango.

## Usage

```js
const orango = require('orango')
const { DEFAULTS, EVENTS } orango.consts

...

orango.on(EVENTS.READY, () => {
  console.log('🍊 Orango is ready!')
})

await orango.connect(DEFAULTS.DATABASE)
```

## AQL

AQL has a many function it provides to allow you to manipulate your data with ease on the backend. <o-orango /> maps 
to the API verbatum with CamelCase. Functions can be used lke so...

```js
const User = orango.model('User')
const { append } = orango.funcs

let query = User.find()
  .one()
  // example of using AQL functions in query
  .let('numbers', append([1, 2, 3], [3, 4, 5], true))
  .return(orango.return.append('numbers'))

// FOR DEMO ONLY - show the raw query data
let queryData = JSON.stringify(query)
console.log(queryData.green)

// FOR DEMO ONLY - show the AQL
let aql = await query.toAQL(true)
console.log(aql.cyan)

// exec query
let result = await query.exec()
console.log(result)

```

## DEFAULTS

* DATABASE = "_system"
* URL = "http://localhost:8529"
* USERNAME = "root"
* PASSWORD = ""

## ERRORS

* COLLECTION_NOT_FOUND
* MODEL_EXISTS
* MODEL_NOT_FOUND
* NOT_CONNECTED

## EVENTS

* DATABASE_CREATED
* DATABASE_DROPPED
* CONNECTED
* DISCONNECTED
* READY

## OPERATIONS

* COUNT
* FIND
* IMPORT
* INSERT
* LINK
* UNLINK
* REMOVE
* REPLACE
* RETURN
* UPSERT
* UPDATE

## SCHEMA.INDEX

Used when defining index types in schemas.

```js
const { SCHEMA } = orango.const
let schema = new orango.Schmea({
  firstName: String,
  lastName: String,
  created: { type: Date, insert: Date.now }
})

schema.addIndex(SCHEMA.INDEX.SKIP_LIST, ['firstName', 'lastName'])
schema.addIndex(SCHEMA.INDEX.HASH, 'created')
```

* HASH
* SKIP_LIST
* GEO
* FULLTEXT
* PERSISITENT