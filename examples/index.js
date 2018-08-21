const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '..')
const orango = require(path.join(rootPath, 'orango'))
const Builder = require('../tang/Builder')

const { importAllDocs } = require(path.join(__dirname, 'migrations'))
require('colors')

orango.events.on('connected', () => {
  console.log('Orango is connected!'.green)
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
  await orango.connect({
    name: 'demo'
  })

  // // Import migration docs
  await importAllDocs()

  const User = orango.model('User')
  let user = await User.findById('rob', {
    noDefaults: false
  }).exec()
  console.log('#user', user)
}

async function main_update_user() {
  require('./models/User')

  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  User.findByIdAndUpdate(
    'rob',
    {
      // desc: 'This is another test'
      role: 'user',
      stats: {
        friends: 1
      }
    },
    {
      printAQL: 'color'
    }
  ).exec()
}

async function main_update_users() {
  require('./models/User')

  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')

  User.updateOne(
    {
      _key: 'rob',
      // role: 'admin'
      $or: [
        {
          role: 'admin'
        },
        {
          desc: 'test'
        }
      ]
    },
    {
      junk: 123,
      desc: 'Test #8',
      stats: {
        friends: {
          $inc: -1
        },
        // followers: {
        //   $inc: 1
        // },
        followers: '++2'
        // friends: 'EXPR( stats.friends + 1 )'
      }
    },
    {
      printAQL: 'color'
    }
  ).exec()
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
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  let result = await User.deleteOne({
    _key: 'jane'
  }).exec()

  console.log('result'.bgRed, result)
}

async function main_find_users() {
  require('./models/User')

  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  let users = await User.find(
    {
      // _key: 'jane'
    },
    {
      printAQL: true,
      sort: '-lastName firstName'
    }
  )

  console.log(users)
}

async function main_find_user() {
  require('./models/User')

  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
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

  const user2 = await User.find(
    {
      id: 'colby'
      // firstName: 'Chase'
    },
    {
      printAQL: true,
      noDefaults: true
    }
  )
    .computed(true)
    .limit(2)
    .select('firstName lastName')
    .exec()

  console.log(user2)
}

async function main_new_user() {
  require('./models/User')

  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')

  let user = new User({
    firstName: 'Lori',
    lastName: 'Taylor',
    devices: [
      {
        _key: 'chrome',
        token: 'abc'
      }
    ]
  })
  await user.save()
}

async function main_query() {
  require('./models/User')
  // Create connection
  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  let result = await User.findByQuery(
    `FOR device IN devices
        FILTER device._key == 'chrome'
          FOR @@doc IN @@collection
            FILTER device.user == @@doc._key`,
    {
      printAQL: true,
      noDefaults: true
    }
  )
    .computed(true)
    .select('firstName lastName')
    // .toAQL()
    .exec()
  console.log(result)
}

async function main_builder() {
  require('./models/User')
  const User = orango.model('User')
  let data = {
    bogus: true,
    desc: 'Hello, world!',
    stats: {
      friends: '++1'
    }
  }
  const result = await Builder.getInstance()
    .data(data)
    .convertTo(User)
    // .intercept(async (data, index, items, args) => {
    //   console.log('intercept'.cyan, data, index, items, args)
    //   await asyncForEach(data, iterateHandler)
    //   return data
    // })
    .toObject({
      noDefaults: true,
      // noDefaults: this._options.noDefaults || false,
      unknownProps: 'strip'
    })
    .exec()

  console.log(result)
}

async function main_model_method() {
  require('./models/User')

  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  let user = await User.getUserDevices('rob', { string: true })
  console.log(user.fullName.cyan)
  console.log(user.devices)
  console.log(JSON.stringify(user))
}

async function main_model_edge_outbound() {
  readFiles(path.join(__dirname, 'models'))

  await orango.connect({
    name: 'demo'
  })

  const User = orango.model('User')
  let user = await User.findByEdge(
    {
      id: 'posts/first',
      collection: 'likes',
      inbound: true
    },
    {
      noDefaults: true,
      printAQL: true
    }
  )
    .computed(true)
    .select('firstName lastName')
    // .toAQL(true)
    .exec()
  console.log(user)
}

async function main_model_edge_inbound() {
  readFiles(path.join(__dirname, 'models'))

  await orango.connect({
    name: 'demo'
  })

  const Post = orango.model('Post')
  let posts = await Post.findByEdge(
    {
      id: 'users/rob',
      collection: 'likes',
      inbound: true
    },
    {
      noDefaults: true,
      // printAQL: true
      printAQL: 'color'
    }
  ).exec()
  console.log(posts)
}

// main()
// main_update_user()
// main_update_users()
// main_delete_users()
// main_find_users()
// main_find_user()
// main_new_user()
main_query()
// main_builder()
// main_model_method()
// main_model_edge_outbound()
// main_model_edge_inbound()
