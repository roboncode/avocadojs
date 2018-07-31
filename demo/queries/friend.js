const db = require('../connector')

async function getFriends(id, count = 100, offset = 0) {
  let cursor = await db.query(
    `FOR f IN friends
      FOR u IN users
        FILTER f.user == @id AND f.friend == u._key
        LIMIT @offset, @count
        RETURN u`,
    { id, offset, count }
  )

  let results = await cursor.all()
  return results
}

module.exports = {
  getFriends
}
