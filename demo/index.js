const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '..')
const arango = require(path.join(rootPath, 'arango'))
const Builder = require('../avocado/Builder')

const {
  importAllDocs
} = require(path.join(__dirname, 'migrations'))
require('colors')

arango.events.on('connected', () => {
  console.log('Arango is connected!'.green)
})

function readFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    require(dir + '/' + files[i])
  }
}

async function main() {
  // Initialize models
  // Note: This can be done before or after the connection
  readFiles(path.join(__dirname, 'models'))

  // // Create connection
  await arango.connect({
    name: 'demo'
  })

  // // Import migration docs
  await importAllDocs()

  const User = arango.model('User')
  let user = await User.findById('rob', {
    noDefaults: false
  })
  console.log('#user', user)
}

async function main_update_user() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')
  User.findByIdAndUpdate('rob', {
    desc: "This is a test"
  }).exec()
}

async function main_update_users() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')

  User.update({
    _key: 'rob',
    // role: 'admin'
    $or: [{
      role: 'admin'
    }]
  }, {
    junk: 123,
    desc: 'Test #8',
    stats: {
      friends: {
        $inc: -1
      },
      // followers: {
      //   $inc: 1
      // },
      followers: '-=2'
      // friends: 'EXPR( stats.friends + 1 )'
    }
  }, {
    printAQL: true
  })
  /*
  // console.log(qb.filter(qb.eq('_key', 'rob')).toAQL())
  console.log(qb.filter(qb.eq('a', qb.str('b'))).toAQL())
  User.update([qb.eq('_key', 'rob').toAQL()], {
    desc: "desc #5 update users"
  })
  */

  // User.update(['_key == "rob"'], {
  //   desc: "desc #5 update users"
  // })

  // User.update({
  //   _key: 'rob',
  //   $or: {}
  // })

  /*
  FOR doc in {}
    FILTER doc._key == 'rob'

  */
}

async function main_delete_users() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')
  let result = await User.deleteOne({
    _key: 'jane'
  }).exec()

  console.log('result'.bgRed, result)
}

async function main_find_users() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')
  let users = await User.find({
    // _key: 'jane'
  }, {
    printAQL: true,
    sort: '-lastName firstName'
  })

  console.log(users)
}

async function main_find_user() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')
  // let user = await User.findById('jane', {
  //   printAQL: true
  // })
  // const user = await User.find({
  //   firstName: 'Chase',
  //   // role: {
  //   //   $ne: 'admin'
  //   // },
  //   // stats: {
  //   //   friends: null
  //   // }
  // }, {
  //   computed: true,
  //   printAQL: true,
  //   limit: 2,
  //   noDefaults: true,
  //   return: 'firstName lastName'
  // })

  const user2 = await User.find({
    firstName: 'Chase'
  })
  .computed(true)
  .options({
    printAQL: true,
    noDefaults: true
  })
  .limit(2)
  .select('firstName lastName')
  .exec()


  console.log(user2)
}

async function main_new_user() {
  require('./models/User')

  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')

  let user = new User({
    firstName: 'Lori',
    lastName: "Taylor",
    devices: [{
      _key: 'chrome',
      token: 'abc'
    }]
  })
  await user.save()
}

async function main_query() {
  require('./models/User')
  // Create connection
  await arango.connect({
    name: 'demo'
  })

  const User = arango.model('User')
  let result = await User.findByQuery(
    `FOR d IN devices
        FILTER d._key == 'chrome'
          FOR u IN users
            FILTER d.user == u._key
      RETURN {firstName: u.firstName, lastName:u.lastName}`, {
      noDefaults: true
    })
  console.log(result)
}

async function main_builder() {
  require('./models/User')
  const User = arango.model('User')
  let data = {
    desc: 'Hello, world!'
  }
  const result = await Builder.getInstance()
  .data(data)
  // .convertTo(User)
  // .intercept(async data => {
  //   console.log('intercept'.cyan, data)
  //   await asyncForEach(data, iterateHandler)
  //   return data
  // })
  // .toObject({
  //   noDefaults: true,
  //   // noDefaults: this._options.noDefaults || false,
  //   unknownProps: this._schemaOptions.strict ? 'strip' : 'allow'
  // })
  .exec()

  console.log('result'.bgRed, result)
}

// main()
// main_update_user()
// main_update_users()
// main_delete_users()
// main_find_users()
//  main_find_users()
// main_find_user()
// main_new_user()
// main_query()
main_builder()