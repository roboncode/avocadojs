const { Model, factory } = require('./tang/Model')

function testModel() {
  let inst = new Model({
    firstName: 'Rob',
    name: 'Rob Taylor',
    lastName: 'Taylor'
  })
  inst.validate()
  console.log(inst.constructor.name)
}

function testFactory() {
  let User = factory('User')
  let user = new User({ firstName: 'Rob' })
  console.log(user)
}

testModel()
testFactory()
