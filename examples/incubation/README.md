# Incubation

These are concepts that either have not been implemented or are WIP (work in progress)

## Query Series

Conjoined queries in a single query call

```js
LET email = 'eddie@vanhalen.com'
LET unverifiedUser = (
    FOR id in identities
        FILTER id.verified == FALSE
        LET users = (FOR u in users RETURN KEEP(u, "firstname", "lastName") )
    RETURN users
)
RETURN { email, unverifiedUser }

let querySeries = Model.createQuerySeries()
querySeries.push( Model.let('name', 'John Smith') )
querySeries.push( Model.let('unverifiedUsers', Identity.find().where({ verified: false }) )
// querySeries.push( User.find().where() ... )
querySeries.exec()
```

## GraphQL

```js
Airport.find().edge('Fligh').outbound('LAX').return({ distinct: true })z
Comment.find().edge('Comment'), fromVertex('Tweet')
```
