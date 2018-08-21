const expect = require('chai').expect
const Builder = require('../tang/Builder')

class Model {
  constructor(data) {
    this.data = data
  }

  toObject() {
    return this.data
  }
}

class Bogus {
}

describe('tang builder', function() {
  describe('create two "default" singletons', function() {
    let builder1 = Builder.getInstance()
    let builder2 = Builder.getInstance()
    it('builders to be the same', function() {
      expect(builder1).to.equal(builder2)
    })
  })

  describe('create two different singletons', function() {
    let builder1 = Builder.getInstance()
    let builder2 = Builder.getInstance('')
    it('builders to be the same', function() {
      expect(builder1).to.not.equal(builder2)
    })
  })

  describe('intercept', function() {
    it('should call intercept', async function() {
      let builder = Builder.getInstance()
      builder.data({ name: 'John Smith' })
      let result = await builder.exec()
      expect(result).to.deep.equal({ name: 'John Smith' })
    })
  })

  describe('convertTo', function() {
    it('should convert data to Model', async function() {
      let builder = Builder.getInstance()
      builder.data({ name: 'John Smith' })
      builder.convertTo(Model)
      let result = await builder.exec()
      expect(result).to.instanceof(Model)
    })
  })

  describe('convertTo with array of items', function() {
    it('should convert data to Model', async function() {
      let builder = Builder.getInstance()
      builder.data([{ name: 'John Smith' }])
      builder.convertTo(Model)
      let result = await builder.exec()
      expect(result[0]).to.instanceof(Model)
    })
  })

  describe('toObject', function() {
    it('should invoke Model.toObject', async function() {
      let builder = Builder.getInstance()
        .data({ name: 'John Smith' })
        .convertTo(Bogus)
        .toObject()
      let result = await builder.exec()
      expect(result).to.be.an('error')
    })
  })

  describe('inspect', function() {
    it('should inspect data\'s current state', async function() {
      let builder = Builder.getInstance()
      builder.data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .inspect()
      let result = await builder.exec()
      expect(result).to.deep.equal({ name: 'John Smith' })
    })
  })

  describe('inspect', function() {
    it('should inspect data\'s current state', async function() {
      let builder = Builder.getInstance()
      let inspectCalled = false
      builder.addMethod('inspect', function (target, index, items, note = 'Inspect') {
        inspectCalled = true
        return target
      })
      builder.data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .inspect()
      await builder.exec()
      expect(inspectCalled).to.be.true
    })
  })

  describe('intercept', function() {
    it('should call intercept', async function() {
      let builder = Builder.getInstance()
      let interceptCalled = false
      builder.data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .intercept(function(item) {
          interceptCalled = true
          return item
        })
      await builder.exec()
      expect(interceptCalled).to.be.true
    })
  })

  describe('exec with handler for testing speed', function() {
    it('should provide report for exec', async function() {
      let builder = Builder.getInstance()
      let execReport
      builder.data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
      await builder.exec(function(report) {
        execReport = report
      })
      expect(execReport).to.be.not.be.empty
    })
  })
})
