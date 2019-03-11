module.exports = async ({ orango }) => {

  const schema = new orango.Schema({
    firstName: String,
    lastName: String,
    created: { type: Date, default: Date.now }
  })

  const Model = orango.createModel(schema)

  class Person extends Model {
    get name() {
      return this.firstName + ' ' + this.lastName
    }

    static newPerson(firstName, lastName) {
      return new Person({
        firstName,
        lastName
      })
    }

    toJSON() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        name: this.name
      }
    }
  }

  orango.model('Person', Person)
  await Person.ready()

  let person = Person.newPerson('John', 'Smith')
  await person.save()

  console.log('person:'.green, person)
  console.log('person as string:'.green, JSON.stringify(person))
  console.log(('My name is ' + person.name).green)
}
