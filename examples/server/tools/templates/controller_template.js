/**
 * This represents a basic REST implementation of a resource using Orango.
 * The Resource model is in "strict" mode and will filter out all undeclared.
 */
const orango = require('orango')
const app = require('../app')
const Resource = orango.model('Resource')
const User = orango.model('User')

/**
 * Create resource
 */
app.post('/resources', async (req, res) => {
  try {
    let resource = new Resource(req.body)
    let doc = await resource.save().id()
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Update resource
 */
app.put('/resources/:id', async (req, res) => {
  try {
    let result = await Resource.findByIdAndUpdate(req.params.id, req.body)
    if (result.modified) {
      res.status(200).send('Ok')
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Delete resource
 */
app.delete('/resources/:id', async (req, res) => {
  try {
    let result = await Resource.findByIdAndDelete(req.params.id)
    if (result.deleted) {
      res.status(200).send('Ok')
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

/**
 * Get resources
 */
app.get('/resources', async (req, res) => {
  let query = {}
  let resources
  try {
    if (req.query.user) {
      // this is more optimized when we know that user is only one user and we know which user
      query.user = req.query.user
      resources = await Resource.findMany(query)
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        // declare a variable with a known document _key (id)
        .var('knownUser', User, req.query.user)
        // we then use that variable to populate the "user" property in resources (second parameter)
        .populate('user', 'knownUser', {
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
      // .toAQL() // RESULTS in the statement below
      // LET user = DOCUMENT('users/rob')
      // FOR doc IN resources
      // FILTER (doc.`user` == "rob")
      // RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    } else {

      // we use this when the user could be one or more users, but we dont know which user
      resources = await Resource.findMany(query, {
          noDefaults: false
        })
        .id()
        .limit(req.query.limit)
        .offset(req.query.offset)
        .populate('user', User, {
          // we are using the Model (as a lookup) in the 2nd param to auto populate
          id: true,
          select: '_key firstName lastName',
          computed: true,
          noDefaults: true
        })
      // .toAQL() // RESULTS in the statement below
      // FOR doc IN resources
      // LET user = DOCUMENT(CONCAT('users/', doc.user))
      // RETURN MERGE(doc, { user: KEEP(user, '_key', 'firstName', 'lastName') })
    }
    res.send(resources)
  } catch (e) {
    res.status(500).send(e)
  }
})

/**
 * Get resource
 */
app.get('/resources/:id', async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id, {
        noDefaults: false
      })
      .id()
      .populate('user', User, {
        // we are using the var as the 2nd param in populate we declared above
        id: true,
        select: '_key firstName lastName',
        computed: true,
        noDefaults: true
      })
    if (resource) {
      res.status(200).send(resource)
    } else {
      res.status(404).send('Not found')
    }
  } catch (e) {
    res.status(500).send(e)
  }
})