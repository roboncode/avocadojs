### Register a model

```js
let schema = arango.Schema(
  {
    email: { type: String, email: {} },
    firstName: String,
    lastName: String,
    avatar: String,
    settings: {
      lang: { type: String, default: 'en-us' },
      timezone: { type: Number, default: -18000 }
    },
    created: Date,
    updated: { type: Date, default: Date.now }
  },
  {
    strict: true, // only properties defined in schema can be save to db
    keepNull: false, //
    indexes: [ // create indexes for items we will query against
      {
        type: 'hash',
        fields: ['email']
      },
      {
        type: 'skipList',
        fields: ['firstName']
      },
      {
        type: 'skipList',
        fields: ['lastName']
      }
    ]
  }
)

// computed properties are returned by the model but never stored in the db
schema.computed.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

// return id instead of _key keeping our data agnostic to the db being used
schema.computed.id = function() {
  return this._key
}

schema.statics.getUsersByDeviceId = async function(deviceId) {
  return await User.findByQuery(
    `FOR device IN devices
        FILTER device._key == '${deviceId}'
          FOR @@doc IN @@collection
            FILTER device.user == @@doc._key`,
    { noDefaults: false }
  )
    .computed(true)
    .exec()
}

module.exports = arango.model('User', schema)
```

### Connect to a database

```js
await arango.connect({ name: 'demo' })
```
