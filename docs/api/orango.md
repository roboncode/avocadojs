---
pageClass: api
sidebarDepth: 3
---

# orango

### get()

Returns an instance of Orango under the database name.

``` js
orango.get(database: String = '_system'): Orango
```

## Properties

### connection

References the connection instance used to connect to ArangoDB [Connection](./connection.md)

``` js
orango.connection: Connection
```

### consts

References a hashmap of constants available in Orango. [Click here for a full list.](./consts.md)

### events

References an instance of `EventDispatcher`. Orango uses this to dispatch events in the system. [You can find a list of events here](./consts.md#events).

### funcs

References Arango functions

**Example**

```js
const { append } = orango.funcs

append({ foo: 1 }, { bar: 2 })
// AQL => APPEND({ foo: 1 }, { bar: 2 })
```

### logger

References an Winston logger instance

To enable logging, change the level on the logger

```js
orango.logger.level = 'info'
```

### Model

References `OrangoModel`. Models extend from `orango.Model` in their definition.

```js
class User extends orango.Model {
  ...
}
```

### return

Returns a new instance of `Return` class.

### Types

Returns a hashmap of types for reference. There are only a few cases where you need to reference this.

## Methods

### checkConnected()

Checks if there is an active connection. If there is not, an error *"Not connected to database"* will be thrown.

### connect() <Badge text="async"/>

Connects to an instance of ArangoDB

``` js
await orango.connect(url: String = 'http://localhost:8529')
```

### disconnect()  <Badge text="async"/>

Disonnects the Orango instance from its connected database.

```js
await orango.disconnect()
```

### log()

Shortcut to Winston logger.log(). See [WinsontJS](https://github.com/winstonjs/winston#readme) for details.

### schema()

Returns an instance of [Schema](./schema.md)

``` js
orango.schema(json: Object, options: Object = {
  strict: Boolean = true,
  type: String,
  indexes: Array = [
    {
        type: String,
        fields: [ String ]
    },
    ...
  ],
}): OrangoSchema
```
#### options

##### strict: Boolean (default = true)

When `strict` is `true`, the schema will strip any unknown properties during validation. When it is `false` no checks or validations are performed against unknown properties.

##### type: String

If `type` is `edge`, the model will generate a edge collection when defined

##### indexes: []

Defines the indexes that will be created in the collection

### model()

Registers a model with a `class`. The `name` of the model should be capitalized. The collection name will automatically be created as a pluralized lowercase version of the name. The optional `collectionName` can be provided to override the default name.

``` js
orango.model(name:String, class, [, collectionName: String ]): class
```

### createCollection() <Badge text="async"/>

Creates a document collection in the connected database. This is used internally by `Orango` when models are defined and a connection is established.

``` js
await orango.createCollection(name: String [, indexes: Array = []]): DocumentCollection
```

### createEdgeCollection() <Badge text="async"/>

Creates an edge collection in the connected database.
This is used internally by `Orango` when models are defined and a connection is established.

``` js
await orango.createEdgeCollection(name: String [, indexes: Array = []]): EdgeCollection
```

### ensureIndexes() <Badge text="async" />

Creates indexes for the collection.
This is used internally by `Orango` when models are defined and a connection is established.

``` js
await ensureIndexes(collectionName: String [, indexes:Array = [] ])
```

### query() <Badge text="async" />

Performs a query call to ArangoDB

```js
await orango.query(aql: String): Cursor
```

### queryToAQL() <Badge text="async" />

Converts an Orango query JSON object and converts it into working AQL.

```JS
await orango.queryToAQL(query:Object, formatted:Booleand = false): String
```

**Usage**

```js
let query = {
  "model": "User",
  "method": "count", 
  "return": {
    "actions":[],
    "one": true
  },
  "where": {
    "active": true
  }
}

let aql = orango.queryToAQL(query, true)

/*
FOR user IN users
   FILTER user.`active` == true
   COLLECT WITH COUNT INTO length
RETURN length
*/
```