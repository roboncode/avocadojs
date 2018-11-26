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
* filter
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
