describe('orango subdocs', function() {

  let orango;

  beforeAll(async () => {
    orango = global.__ORANGO__;
  });

  describe('new doc - no modification', function() {
    it('be a NEW DOCUMENT', async function() {
      const Test = orango.model('Test')
      let test = new Test()
      let aql = await test.save().toAQL()
      expect(aql).toBe('NEW DOCUMENT')
    })
  })

  describe('force update and no _key', function() {
    it('be an error', async function() {
      try {
        const Test = orango.model('Test')
        let test = new Test()
        await test.save().toAQL()
      } catch (e) {
        expect(e.message).toBe('Missing required _key')
      }
    })
  })

  describe('with _key', function() {
    it('be valid', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1' })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('defaults', function() {
    it('to have defaults', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1' })
      let aql = await test.save().defaults(true).toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"name":"test"} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of strings', function() {
    it('to have array of strings', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1', tags: ['foo', 'bar'] })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"tags":["foo","bar"]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      const Test = orango.model('Test')
      // no $id will be present because we are adding item WITHOUT directly
      let test = new Test({ _key: '1', comments: [{ text: 'test' }] })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"comments":[{"text":"test"}]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of objects with $id', function() {
    it('to have array of objects with $id of "test"', async function() {
      const Test = orango.model('Test')
      // $id will present because we are adding item WITH $id directly
      let test = new Test({
        _key: '1',
        comments: [{ $id: 'test', text: 'test' }]
      })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"comments":[{"$id":"test","text":"test"}]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1',
        comments: [{ text: 'test' }]
      })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"comments":[{"text":"test"}]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of objects with custom $id', function() {
    it('to have array of objects with custom $id', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1',
        comments: [{ $id: 'test', text: 'test' }]
      })
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 UPDATE $test WITH {"comments":[{"$id":"test","text":"test"}]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array pushing primitive values', function() {
    it('to have array of primitive values', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.tags.push('foo', 'bar')
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 LET tags = APPEND($test.tags, ["foo","bar"]) UPDATE $test WITH {"tags":tags} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array pushing objects', function() {
    it('to have array of primitive values with $id', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments.push({ text: 'test' })
      let aql = await test.save().toAQL()
      expect(aql).toMatch(/"\$id"/)
    })
  })

  describe('array pulling objects', function() {
    it('to have array of primitive values with $id', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments.pull('test')
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 LET comments = MINUS($test.comments, ( FOR item IN $test.comments || [] FOR id IN ["test"] FILTER item.$id == id RETURN item)) UPDATE $test WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array pushing objects with $push', function() {
    it('to append', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments = {
        $push: [{ text: 'test' }]
      }
      let aql = await test.save().toAQL()
      expect(aql).toMatch(/"\$id"/)
    })
  })

  describe('array pulling objects with $pull', function() {
    it('to minus', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments = {
        $pull: { $or: [{ $id: 'test' }, { user: '@test' }] }
      }
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 LET comments = MINUS($test.comments, ( FOR $test_comment IN $test.comments FILTER (($test_comment.$id == "test") OR ($test_comment.`user` == "@test")) RETURN $test_comment)) UPDATE $test WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array pulling objects with $pull', function() {
    it('to minus', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments = {
        $pull: ['foo', 'bar']
      }
      let aql = await test.save().toAQL()
      expect(aql).toBe(
        'LET modified = COUNT( FOR $test IN tests FILTER ($test.`_key` == "1") LIMIT 1 LET comments = MINUS($test.comments, ( FOR item IN $test.comments || [] FOR id IN ["foo","bar"] FILTER item.$id == id RETURN item)) UPDATE $test WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })
})
