module.exports = ({ orango }) => {
  class Tweet extends orango.Model {
    constructor(data) {
      super(data, Tweet.schema)
    }
  }

  Tweet.schema = orango.schema({
    user: String,
    text: String,
    tags: orango.types.Array,
    created: Date,
    updated: Date
  })

  Tweet.hooks = {
    insert(model) {
      model.created = Date.now()
    },
    update(model) {
      model.updated = Date.now()
    }
  }

  return orango.model('Tweet', Tweet)
}
