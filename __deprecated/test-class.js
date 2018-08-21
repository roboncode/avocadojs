class BaseModel {
  constructor(data) {
    this.isVerified = true
    this.createdAt = new Date()
    this.setModelData(data)
    console.log('junk1', this.constructor.junk)
  }

  setModelData(data) {
    Object.assign(this, data)
  }

  setName(name) {
    this.name = name
  }
}

BaseModel.junk = 'yes it is'

class MyModel extends BaseModel {
  constructor(name, data) {
    super(data)
    this.setName(name)
    console.log('junk2', this.constructor.junk)
    // this.setModelData(data)
  }
}

class YourModel extends BaseModel {
  constructor(name, data) {
    super(data)
    this.setName(name)
    console.log('junk2', this.constructor.junk)
    // this.setModelData(data)
  }
}

MyModel.junk ='no you'

let test1 = new MyModel('rob', { age: 45 })
let test2 = new MyModel('john', { age: 20 })
let test3 = new YourModel('sue', { age: 10 })
let test4 = new YourModel('barb', { age: 26 })
console.log(test1)
console.log(test2)
console.log(test3)
console.log(test4)
console.log(MyModel.junk)
