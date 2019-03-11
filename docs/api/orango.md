---
pageClass: api
sidebarDepth: 3
---

# orango

> The default instance is used in the API documentation below but you can optionally replace `orango` with your own instance name like so...

**Using the default instance**

```js
orango.connect() // connects to "_system"
...
orango.model('User')
```

**Using an orango instance**
```js
const db = orango.get('myapp')
...
db.model('User')
```

### get()

Returns an instance of orango with reference to that database.

``` js
orango.get(database: String = '_system'): Orango
```

## Properties

<!-- ### connection

References the connection instance used to connect to ArangoDB [Connection](./connection.md)

``` js
orango.connection: Connection
``` -->

### consts

References a hashmap of constants available in Orango. [Click here for a full list.](./consts.md)

### events

References an instance of `EventDispatcher`. Orango uses this to dispatch events in the system. [You can find a list of events here](./consts.md#events).

### funcs

References Arango [functions](https://docs.arangodb.com/devel/AQL/Functions/)

**Example**

```js
const { append } = orango.funcs

append({ foo: 1 }, { bar: 2 })
// AQL => APPEND({ foo: 1 }, { bar: 2 })
```

### isConnected

Returns a boolean based on connection status.

### logger

References a [Winston logger](https://github.com/winstonjs/winston) instance

To enable logging, change the level on the logger

```js
orango.logger.level = 'info'
```

### return

Returns a new instance of [Return](return.md) class.

### Schema

Reference to the [Schema](schema.md) class.

### types

Returns a hashmap of [types](types.md) for reference. There are only a few cases where you need to reference this.

## Methods

### checkConnected()

Checks if there is an active connection. If there is no connection, an error *"Not connected to database"* will be thrown.

### connect() <Badge text="async"/>

Connects to an instance of ArangoDB

``` js
await orango.connect({
  url: String = 'http://localhost:8529', 
  username: String = 'root',
  password: String = ''
})
```

### disconnect()  <Badge text="async"/>

Disonnects the Orango instance from its connected database.

```js
await orango.disconnect()
```

### log()

Shortcut to Winston logger.log(). See [WinsontJS](https://github.com/winstonjs/winston#readme) for details.

<!-- ### schema()

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
-->

### model()

Registers a model to a `class`. The `name` of the model should be capitalized. The collection name will automatically be created as a pluralized lowercase version of the name. The optional `collectionName` can be provided to override the default name.

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

### createDatabase() <Badge text="async" />

Creates a database if the database does not exist. Must be connected to the `_system ` database when performing this operation.

```js
await orango.createDatabase(database, users = [{ 
  url: String,
  username: String,
  password: String
}])
```

### dropDatabase() <Badge text="async" />

Removes a database if the database exists. Must be connected to the `_system` database when performing this operation.

```js
await orango.dropDatabase(database)
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