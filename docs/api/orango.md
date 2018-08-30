---
pageClass: api
---

# Orango

## get()

Static method gets an instance of Orango

``` js
Orango.get(name:String): Orango
```

## connect()

Connects to an instance of ArangoDB

``` js
orango.connect(name: String = '_system', url: String = 'http://localhost:8529')
```

## uid()

Returns a unique id. It uses the same mechanics as Mongo's ObjectId()

``` js
orango.uid():String
```

## getConnection()

Returns an instance of [Connection](./connection.md)

``` js
orango.getConnection(): Connection
```

## Schema()

Returns an instance of [Schema](./schema.md)

``` js
orango.Schema(json: Object, options: Object = {})
```

## toArray()

Converts an associative array into an index array. This is can be used in migrations

``` js
orango.toArray(data: Object): Array
```

## checkConnected()

Checks whether or not current instance is connected.

``` js
orango.checkConnected(): Boolean
```

## model()

Registers a model with a schema. The `name` of the model should be capitalized. The collection name will automatically be created as a pluralized lowercase version of the name. The optional collectionName can be provided to override the default name.

``` js
orango.model(name:String, schema:Object 
[, collectionName: String = '']): DocumentModel
```

## createCollection() <Badge text="async" type="error"/>

Creates a document collection in the connected database.

``` js
await orango.createCollection(name: String 
[, indexes: Array, truncate: Boolean = false): DocumentCollection
```

## createEdgeCollection() <Badge text="async" type="error"/>

Creates an edge collection in the connected database.

``` js
await orango.createEdgeCollection(name: String [, truncate = false]): EdgeCollection
```

## ensureIndexes() <Badge text="async" type="error"/>

Creates indexes for the collection.

``` js
await ensureIndexes(collectionName: String [, indexes:Array = [] ])
```
