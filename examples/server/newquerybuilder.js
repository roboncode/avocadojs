require('app-module-path').addPath(__dirname)
const orango = require('orango')
const readFiles = require('./helpers/readFiles')
const pluralize = require('pluralize')
const {
  RELATION
} = orango.CONSTS
const {
  filterToAQL,
} = orango.helpers
const merge = require('lodash/merge')
require('colors')

/*
Tweet hasOne
User

Comment hasOne
User

User hasMany
Tweet
Comment

User hasOne
User_Role
*/

const AQB = orango.AQB

function parseQuery(data) {
  let ModelCls = orango.model(data.model)
  let col = ModelCls.collectionName
  let doc = pluralize.singular(col)
  let aql = AQB.for(doc).in(col)

  let result = doc
  if (data.select) {
    let select = data.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(doc, select)
  }

  if (data.filter) {
    let filterAQL = filterToAQL(data.filter, doc)
    aql = aql.filter(AQB.expr(filterAQL))
    if (data.offset && data.limit) {
      aql = aql.limit(data.offset, data.limit)
    } else if (data.offset) {
      aql = aql.limit(data.offset, 10)
    } else if (data.limit) {
      aql = aql.limit(data.limit)
    }
  }

  // dummy
  // these are just properties???
  // let merges = ['junk', 'test']
  let merges = []
  // these are populates
  let appends = []

  if (data.populate) {
    for (let pop of data.populate) {
      let PopModelCls = orango.model(pop.model)
      const relation = ModelCls.getRelation(pop.model)
      console.log(data.model.blue, 'has', relation.has.magenta, pop.model.green)
      // console.log(pop.model, 'hasMany'.magenta, data.model, '=', PopModelCls._hasMany)
      switch (relation.has) {
        case RELATION.MANY:
          aql = aql.let(PopModelCls.collectionName, parseQuery(pop))
          appends.push(PopModelCls.collectionName)
          break
        case RELATION.ONE:
          // console.log(AQB.DOCUMENT(AQB.CONCAT(AQB.str(`${col}/`), `${doc}.${relation.ref}`)).toAQL())
          // console.log('whois', pop.filter)
          if (pop.filter) {
            pop.filter = merge({
              _key: `@{${doc}.${relation.ref}}`
            }, pop.filter)
          } else {
            pop.filter = {
              _key: `@{${doc}.${relation.ref}}`
            }
          }

          pop.limit = 1

          aql = aql.let(relation.as, AQB.FIRST(parseQuery(pop)))

          if (pop.merge) {
            merges.push(relation.as)
          } else {
            appends.push(relation.as)
          }
          break
      }
    }
  }

  let appendData = {}
  for (let name of appends) {
    appendData[name] = name
  }

  if (appends.length && merges.length) {
    result = AQB.MERGE(result, AQB.expr(merges.join(', ')), appendData)
  } else if (merges.length) {
    result = AQB.MERGE(result, AQB.expr(merges.join(', ')))
  } else if (appends.length) {
    result = AQB.MERGE(result, appendData)
  }

  aql = aql.return(result)
  return aql
}

async function main() {
  readFiles('models')

  let result = parseQuery({
    model: 'Tweet',
    method: 'find',
    filter: {
      $or: [{
        active: true
      }, {
        created: {
          $lte: Date.now()
        }
      }]
    },
    limit: 10,
    offset: 1,
    select: 'text',
    populate: [{
        // name: 'user',
        model: 'User',
        computed: true,
        filter: {
          active: true
        },
        select: 'firstName lastName',
        // merge: true
      },
      {
        model: 'Comment',
        limit: 10,
        computed: true,
        populate: [{
          // name: 'user',
          model: 'User',
          computed: true,
          select: 'firstName lastName'
        }]
      }
    ],
    computed: true
  })

  console.log(result.toAQL().green)
}

main()