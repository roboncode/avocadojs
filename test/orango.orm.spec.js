const ORM = require('../lib/ORM')


describe('orango.orm', function() {

  let orango;
  let RETURN;

  beforeAll(async () => {
    orango = global.__ORANGO__;
    RETURN = orango.CONSTS.RETURN
  });

  describe('for in', function() {
    const orm = new ORM()
    orm.method('find')
    orm.collection({ name: 'users' })

    it('should do something #1', async function() {
      let aql = await orm.return(RETURN.DOC).toAQL()
      expect(aql).toBe('FOR $user IN users RETURN $user')
    })
  })

  describe('for in with filter', function() {
    const orm = new ORM()
    orm.method('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      name: 'rob'
    })

    it('should do something #2', async function() {
      let aql = await orm.return(RETURN.DOC).toAQL()
      expect(aql).toBe('FOR $user IN users FILTER ($user.`name` == "rob") RETURN $user')
    })
  })

  describe('$or filter', function() {
    const orm = new ORM()
    orm.method('find')
    orm.collection({ name: 'users' })
    orm.criteria({
      $or: [ { name: 'rob' }, { name: 'john' } ]
    })

    it('should do something', async function() {
      let aql = await orm.return(RETURN.DOC).toAQL()
      expect(aql).toBe(
        'FOR $user IN users FILTER (($user.`name` == "rob") OR ($user.`name` == "john")) RETURN $user'
      )
    })
  })

  describe('increment filter using $inc', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.method('update')
      orm.collection({ name: 'users' })
      orm.model(orango.model('Test'))
      orm.data({
        stats: {
          friends: {
            $inc: 1
          }
        }
      })

      let aql = await orm.toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $user IN users UPDATE $user WITH {"stats":{"friends":$user.stats.friends+1}} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('increment filter using ++', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.method('update')
      orm.collection({ name: 'users' })
      orm.model(orango.model('Test'))
      orm.data({
        friends: '++1'
      })

      let aql = await orm.toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $user IN users UPDATE $user WITH {"friends":$user.friends+1} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('increment filter using EXPR()', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.method('update')
      orm.collection({ name: 'users' })
      orm.model(orango.model('Test'))
      orm.data({
        friends: 'EXPR(friends+1)'
      })

      let aql = await orm.toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $user IN users UPDATE $user WITH {"friends":$user.friends+1} IN users RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('custom query', function() {
    it('should do something', async function() {
      const orm = new ORM()
      orm.method('find')
      orm.collection({ name: 'users' })
      orm.options({ printAQL: 'color' })
      orm.query(`FOR @@doc IN @@collection FILTER device.user == @@doc._key`)

      let aql = await orm.return(RETURN.DOC).toAQL(true)
      expect(aql).toBe('FOR $user IN users FILTER device.user == $user._key RETURN $user')
    })
  })
})
