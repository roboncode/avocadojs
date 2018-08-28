let expect = require('chai').expect
const orango = require('../lib')
const ORM = require('../lib/ORM')
const criteriaBuilder = require('../lib/helpers/criteriaBuilder')

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
  describe('new doc - no modification', function() {
    it('be a NEW DOCUMENT', async function() {
      let test = new Test()
      let aql = await test.toAQL()
      // .save({
      //   // upsert: true
      // })
      expect(aql).to.equal('NEW DOCUMENT')
    })
  })

  describe('force update and no _key', function() {
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

  describe('with _key', function() {
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

  describe('withDefaults', function() {
    it('to have defaults', async function() {
      let test = new Test({ _key: 1 })
      let aql = await test.toAQL({ update: true, withDefaults: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"name":"test"} IN tests'
      )
    })
  })

  describe('array of strings', function() {
    it('to have array of strings', async function() {
      let test = new Test({ _key: 1, tags: ['foo', 'bar'] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"tags":["foo","bar"]} IN tests'
      )
    })
  })

  describe('array of objects with no $id', function() {
    it('to have array of objects with no $id', async function() {
      let test = new Test({ _key: 1, comments: [{ text: 'test' }] })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) UPDATE doc WITH {"comments":[{"text":"test"}]} IN tests'
      )
    })
  })

  describe('array of objects with $id', function() {
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

  describe('array of objects with no $id', function() {
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

  describe('array of objects with custom $id', function() {
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

  describe('array pushing primitive values', function() {
    it('to have array of primitive values', async function() {
      let test = new Test({
        _key: 1
      })
      test.tags.push('foo', 'bar')
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET tags = APPEND(doc.tags, ["foo","bar"]) UPDATE doc WITH {"tags":tags} IN tests'
      )
    })
  })

  describe('array pushing objects', function() {
    it('to have array of primitive values without $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.comments.push({ text: 'test' })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET comments = APPEND(doc.comments, [{"text":"test"}]) UPDATE doc WITH {"comments":comments} IN tests'
      )
    })
  })

  describe('array pushing objects', function() {
    it('to have array of primitive values with $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.posts.push({ text: 'test' })
      let aql = await test.toAQL({ update: true })
      expect(aql).to.match(
        /FOR doc IN tests FILTER \(doc.`_key` == 1\) LET posts = APPEND\(doc.posts, \[{"text":"test","\$id":\"\w+\"}\]\) UPDATE doc WITH {"posts":posts} IN tests/
      )
    })
  })

  describe('array pulling objects', function() {
    it('to have array of primitive values with $id', async function() {
      let test = new Test({
        _key: 1
      })
      test.posts.pull('test')
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET posts = MINUS(doc.posts, ( FOR item IN doc.posts || [] FOR id IN ["test"] FILTER item.$id == id RETURN item)) UPDATE doc WITH {"posts":posts} IN tests'
      )
    })
  })

  describe('array pushing objects with $push', function() {
    it('to append', async function() {
      let test = new Test({
        _key: 1
      })
      test.comments = {
        $push: [{ text: 'test' }]
      }
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET comments = APPEND(doc.comments, [{"text":"test"}]) UPDATE doc WITH {"comments":comments} IN tests'
      )
    })
  })

  describe('array pulling objects with $pull', function() {
    it('to minus', async function() {
      let test = new Test({
        _key: 1
      })
      test.comments = {
        $key: 'name',
        $pull: { $or: [{ $id: 'test' }, { user: '@test' }] }
      }
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET comments = MINUS(doc.comments, ( FOR item IN doc.comments FILTER ((item.$id == "test") OR (item.`user` == "@test")) RETURN item)) UPDATE doc WITH {"comments":comments} IN tests'
      )
    })
  })

  describe('array pulling objects with $pull', function() {
    it('to minus', async function() {
      let test = new Test({
        _key: 1
      })
      test.comments = {
        $pull: ['foo', 'bar']
      }
      let aql = await test.toAQL({ update: true })
      expect(aql).to.equal(
        'FOR doc IN tests FILTER (doc.`_key` == 1) LET comments = MINUS(doc.comments, ( FOR item IN doc.comments || [] FOR id IN ["foo","bar"] FILTER item.$id == id RETURN item)) UPDATE doc WITH {"comments":comments} IN tests'
      )
    })
  })
})
