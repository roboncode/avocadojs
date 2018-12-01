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

let counter = 1
const AQB = orango.AQB

function isOne(method) {
  switch (method) {
    case 'findOne':
      return true
  }
  return false
}

function parseQuery(data) {
  if (data.method === 'findOne') {
    data.limit = 1
  }
  let ModelCls = orango.model(data.model)
  let col = ModelCls.collectionName

  if (data.name === col) {
    throw new Error('Name cannot be the same name as collection: ' + col)
  }

  let name = data.name || pluralize.singular(col)
  let aql = AQB.for(name).in(col)

  let result = name
  if (data.select) {
    let select = data.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(name, select)
  }

  if (data.filter) {
    let filterAQL = filterToAQL(data.filter, name)
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
      // switch (relation.has) {
      //   case RELATION.MANY:
      //     aql = aql.let(PopModelCls.collectionName, parseQuery(pop))
      //     appends.push(PopModelCls.collectionName)
      //     break
      //   case RELATION.ONE:
      //     // console.log(AQB.nameUMENT(AQB.CONCAT(AQB.str(`${col}/`), `${name}.${relation.ref}`)).toAQL())
      //     // console.log('whois', pop.filter)
      //     if (pop.filter) {
      //       pop.filter = merge({
      //         _key: `@{${name}.${relation.ref}}`
      //       }, pop.filter)
      //     } else {
      //       pop.filter = {
      //         _key: `@{${name}.${relation.ref}}`
      //       }
      //     }

      //     pop.limit = 1

      //     aql = aql.let(relation.as, AQB.FIRST(parseQuery(pop)))

      //     if (pop.merge) {
      //       merges.push(relation.as)
      //     } else {
      //       appends.push(relation.as)
      //     }
      //     break
      // }

      // let name = pop.name || pluralize.singular(data.model.charAt(0).toLowerCase() + data.model.slice(1))
      // let name = isOne(pop.method) ? pluralize.singular(pop.model.charAt(0).toLowerCase() + pop.model.slice(1)) : PopModelCls.collectionName
      // let name = pop.name
      // if(!name) {
      //   name = isOne(pop.method) ? pluralize.singular(pop.model.charAt(0).toLowerCase() + pop.model.slice(1)) : PopModelCls.collectionName
      // }
      let popName = pop.name || PopModelCls.collectionName
      if (isOne(pop.method)) {
        aql = aql.let(popName, AQB.FIRST(parseQuery(pop)))
      } else {
        aql = aql.let(popName, parseQuery(pop))
      }

      if (pop.merge) {
        merges.push(popName)
      } else {
        appends.push({
          key: pop.append || popName,
          value: popName
        })
      }
    }
  }

  let appendData = {}
  for (let i = 0; i < appends.length; i++) {
    appendData[appends[i].key] = appends[i].value
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
    name: 'tweeter',
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
        name: 'fred',
        // merge: true,
        model: 'User',
        method: 'findOne',
        filter: {
          _key: '@{tweeter.user}',
          active: true
        },
        computed: true,
        select: 'firstName lastName',
      },
      {
        name: 'comment',
        append: 'comments',
        model: 'Comment',
        filter: {
          _key: '@{tweeter.user}'
        },
        limit: 10,
        computed: true,
        populate: [{
          name: 'user',
          model: 'User',
          method: 'findOne',
          filter: {
            _key: '@{comment.user}'
          },
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