const builder = require('../../avocado/Builder')
const db = require('../connector')
const users = require('../collections/users')

// fetchById(id)
// fetchByProp(prop)
// find()
// inc()
// updateDoc()

async function getUser(id) {
  // let cursor = await db.query(`RETURN DOCUMENT(@id)`, { id: 'users/' + id })
  // return await cursor.next()
  let user = await users.document(id)
  let data = builder
    .factory(user)
    .convertTo('User')
    .toObject({ computed: true, noDefaults: false })
    .exec()
  return data
}

async function getUserByAuthId(authId) {
  const cursor = await db.query(
    `FOR user IN users
    FILTER user.authId == @authId
    RETURN user`,
    { authId }
  )
  return await cursor.next()
}

async function incStat(id, prop, options) {
  const cursor = await db.query(
    `LET doc = DOCUMENT(CONCAT('users/', @id))
     UPDATE doc WITH {
      stats: {
        @prop: doc.stats.@prop + 1
      }
     } IN users`,
    { id, prop }
  )
  return await cursor.next()
}

async function updateUser(id, data, returnNew = false) {
  try {
    let result = await users.update(id, data, {
      returnNew
    })
    if (returnNew) {
      return result.new
    }
    return result
  } catch (e) {
    return e.response.body
  }
}

module.exports = {
  getUser,
  getUserByAuthId,
  updateUser,
  incStat
}
