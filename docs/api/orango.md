---
pageClass: api
sidebarDepth: 3
---

# Orango

## Static

### get()

Static method gets an instance of Orango

``` js
Orango.get(name:String): Orango
```

## Properties

### connection

Returns an instance of [Connection](./connection.md)

``` js
orango.connection: Connection
```

## Methods

### connect()

Connects to an instance of ArangoDB

``` js
orango.connect(name: String = '_system', url: String = 'http://localhost:8529')
```

### uid()

Returns a unique id. It uses the same mechanics as Mongo's ObjectId()

``` js
orango.uid():String
```

### Schema()

Returns an instance of [Schema](./schema.md)

``` js
orango.Schema(json: Object, options: Object = {
  strict: Boolean = false,
  edge: Boolean = false,
  indexes: Array = [
    {
        type: String,
        fields: [String]
    },
    ...
  ],
})
```
#### options

##### strict: Boolean (default = false)

If `strict` is `true`, the schema will strip any unknown properties during validation

##### edge: Boolean (default = false)

If `edge` is `true`, the model will generate a edge collection when defined

##### indexes: []

Defines the indexes that will be created in the collection

### model()

Registers a model with a schema. The `name` of the model should be capitalized. The collection name will automatically be created as a pluralized lowercase version of the name. The optional `collectionName` can be provided to override the default name.

``` js
orango.model(name:String, schema:Schema 
[, collectionName: String = '']): DocumentModel
```

### createCollection() <Badge text="async" type="error"/>

Creates a document collection in the connected database. This is used internally by `Orango` when models are defined and a connection is established.

``` js
await orango.createCollection(name: String 
[, indexes: Array, truncate: Boolean = false): DocumentCollection
```

### createEdgeCollection() <Badge text="async" type="error"/>

Creates an edge collection in the connected database.
This is used internally by `Orango` when models are defined and a connection is established.

``` js
await orango.createEdgeCollection(name: String [, truncate = false]): EdgeCollection
```

### ensureIndexes() <Badge text="async" type="error"/>

Creates indexes for the collection.
This is used internally by `Orango` when models are defined and a connection is established.

``` js
await ensureIndexes(collectionName: String [, indexes:Array = [] ])
```
