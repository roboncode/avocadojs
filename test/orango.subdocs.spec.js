let expect = require('chai').expect
let orango = require('../lib')

describe('orango subdocs', function() {
  describe('new doc - no modification', function() {
    it('be a NEW DOCUMENT', async function() {
      const Test = orango.model('Test')
      let test = new Test()
      let aql = await test.toAQL()
      expect(aql).to.equal('NEW DOCUMENT')
    })
  })

  describe('force update and no _key', function() {
    it('be an error', async function() {
      try {
        const Test = orango.model('Test')
        let test = new Test()
        await test.toAQL()
      } catch (e) {
        expect(e.message).to.be.equal('Missing required _key')
      }
    })
  })

  describe('with _key', function() {
    it('be valid', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1' })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('withDefaults', function() {
    it('to have defaults', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1' })
      let aql = await test.toAQL({ update: true, withDefaults: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"name":"test"} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of strings', function() {
    it('to have array of strings', async function() {
      const Test = orango.model('Test')
      let test = new Test({ _key: '1', tags: ['foo', 'bar'] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"tags":["foo","bar"]} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })

  describe('array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      const Test = orango.model('Test')
      // no $id will be present because we are adding item WITHOUT directly
      let test = new Test({ _key: '1', comments: [{ text: 'test' }] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"comments":[{"$id":"test","text":"test"}]} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") UPDATE doc WITH {"comments":[{"$id":"test","text":"test"}]} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") LET tags = APPEND(doc.tags, ["foo","bar"]) UPDATE doc WITH {"tags":tags} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.match(/"\$id"/)
    })
  })

  describe('array pulling objects', function() {
    it('to have array of primitive values with $id', async function() {
      const Test = orango.model('Test')
      let test = new Test({
        _key: '1'
      })
      test.comments.pull('test')
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") LET comments = MINUS(doc.comments, ( FOR item IN doc.comments || [] FOR id IN ["test"] FILTER item.$id == id RETURN item)) UPDATE doc WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.match(/"\$id"/)
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") LET comments = MINUS(doc.comments, ( FOR item IN doc.comments FILTER ((item.$id == "test") OR (item.`user` == "@test")) RETURN item)) UPDATE doc WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
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
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'LET modified = COUNT( FOR doc IN tests FILTER (doc.`_key` == "1") LET comments = MINUS(doc.comments, ( FOR item IN doc.comments || [] FOR id IN ["foo","bar"] FILTER item.$id == id RETURN item)) UPDATE doc WITH {"comments":comments} IN tests RETURN 1) RETURN { modified }'
      )
    })
  })
})
