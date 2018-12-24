module.exports = orango => {
  class Member extends orango.Model {
    constructor(data) {
      super(data, Member.schema)
    }

    get fullName() {
      return (this.firstName + ' ' + this.lastName).trim()
    }
  }

  /**
   * Validates data going to ArangoDB
   */
  Member.schema = orango.Schema(
    { firstName: String, lastName: String, role: String },
    { indexes: [{ type: 'hash', fields: ['role'] }] }
  )

  /**
   * Unmarshal data coming from ArangoDB
   */
  Member.struct = {
    band: 'Band'
  }

  return orango.model('Member', Member)
}
