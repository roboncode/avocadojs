describe('orango connection', function() {
  let orango;

  beforeAll(async () => {
    orango = global.__ORANGO__;
  });

  describe('with no options', function() {
    it('connect to default "test" db', async function() {
      let conn = orango.get('system').connection
      expect(conn.url + '/' + conn.name).toBe('http://localhost:8529/_system')
    })
  })

  describe('with options', function() {
    it('connect to "test" db', async function() {
      let conn = orango.connection
      expect(conn.url + '/' + conn.name).toBe('http://localhost:8529/test')
    })
  })

  describe('check if connected', function() {
    it('to be connected', async function() {
      expect(orango.connection.connected).toBe(true)
    })
  })

  describe('create to new database', function() {
    it('create a new databae', async function() {
      let conn = orango.get('system').connection
      let dbs = await conn.db.listDatabases()
      expect(dbs).toEqual(expect.arrayContaining(['test']))
    })
  })

  describe('disconnect from database', function() {
    it('be disconnect', async function() {
      try {
        await orango.get('disconnect').disconnect()
      } catch (e) {
        console.log('ERROR'.bgRed, e.message)
      }
      expect(orango.get('disconnect').connection.connected).toBe(false)
    })
  })

  describe('with invalid credientials', function() {
    it('should fail', async function() {
      try {
        await orango.connect('auth', {
          username: 'bogus',
          password: 'bogus'
        })
      } catch (e) {
        expect(e.message).toBeDefined()
      }
    })
  })
})
