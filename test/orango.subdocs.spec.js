let expect = require('chai').expect
const orango = require('../lib')

let schema = orango.Schema(
  {
    name: { type: String, default: 'test' },
    tags: [String],
    posts: [{ $id: String, text: String }],
    comments: [{ text: String }]
  },
  {
    strict: true
  }
)

const Test = orango.model('Test', schema)

describe('orango subdocs', function() {
  xdescribe('new doc - no modification', function() {
    it('be a NEW DOCUMENT', async function() {
      let test = new Test()
      let aql = await test.toAQL()
      // .save({
      //   // upsert: true
      // })
      expect(aql).to.equal('NEW DOCUMENT')
    })
  })

  xdescribe('new doc, force update, no _key', function() {
    it('be an error', async function() {
      try {
        let test = new Test()
        await test.toAQL()
        // .save({
        //   update: true
        //   // upsert: true
        // })
      } catch (e) {
        expect(e.message).to.be.equal('Missing required _key')
      }
    })
  })

  xdescribe('new doc with _key', function() {
    it('be valid', async function() {
      let test = new Test({ _key: 1 })
      let aql = await test.toAQL({ update: true })
      // .save({
      //   update: true
      //   // withDefaults: true
      // })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {} IN tests'
      )
    })
  })

  xdescribe('new doc withDefaults', function() {
    it('to have defaults', async function() {
      let test = new Test({ _key: 1 })
      let aql = await test.toAQL({ update: true, withDefaults: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"tags":[],"posts":[],"comments":[],"name":"test"} IN tests'
      )
    })
  })

  xdescribe('new doc withDefaults', function() {
    it('to have defaults', async function() {
      let test = new Test({ _key: 1 })
      let aql = await test.toAQL({ update: true, withDefaults: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"tags":[],"posts":[],"comments":[],"name":"test"} IN tests'
      )
    })
  })

  xdescribe('new doc array of strings', function() {
    it('to have array of strings', async function() {
      let test = new Test({ _key: 1, tags: ['foo', 'bar'] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"tags":["foo","bar"]} IN tests'
      )
    })
  })

  xdescribe('new doc array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      let test = new Test({ _key: 1, comments: [{ text: 'test' }] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests'
      )
    })
  })

  xdescribe('new doc array of objects with $id', function() {
    it('to have array of objects with no $id', async function() {
      let test = new Test({
        _key: 1,
        comments: [{ $id: 'test', text: 'test' }]
      })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests'
      )
    })
  })

  xdescribe('new doc array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      let test = new Test({
        _key: 1,
        posts: [{ text: 'test' }]
      })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"posts":[{"text":"test"}]} IN tests'
      )
    })
  })

  xdescribe('new doc array of objects with custom $id', function() {
    it('to have array of objects with custom $id', async function() {
      let test = new Test({
        _key: 1,
        posts: [{ $id: 'test', text: 'test' }]
      })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"posts":[{"$id":"test","text":"test"}]} IN tests'
      )
    })
  })

  xdescribe('new doc array pushing primitive values', function() {
    it('to have array of primitive values', async function() {
      let test = new Test({
        _key: 1
      })
      test.tags.push('a', 'b', 'c')
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"tags":["a","b","c"]} IN tests'
      )
    })
  })

  xdescribe('new doc array pushing objects', function() {
    it('to have array of primitive values with no $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.comments.push({ text: 'test' })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests'
      )
    })
  })

  describe('new doc array pushing objects', function() {
    it('to have array of primitive values with $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.posts.push({ text: 'test' })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.match(/FOR doc IN tests FILTER \(doc.`_key` == 1\)  LET posts = APPEND\(doc.posts, \[{"text":"test","\$id":\"\w+\"}\]\)  UPDATE doc WITH {"posts":posts} IN tests/)
    })
  })

  xdescribe('new doc array pushing objects', function() {
    it('to have array of primitive values with $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.posts.pull('test')
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'what'
      )
    })
  })
})
