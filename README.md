# AvocadoJS
Elegant ArangoDB object modeling for Node.js

<img src="https://image.flaticon.com/icons/svg/835/835420.svg" width="150px">

Built using [Joi](https://github.com/hapijs/joi) and [ArangoJS](https://github.com/arangodb/arangojs)

*** In Development ***

## Quick Start

### Run Docker ArangoDB

```
docker-compose up -d
```

### Run Demo

Running the demo will:

- Create a database named "demo"
- Create several collections with the appropriate indexes
- Populate the collections with mock data
- Perform queries on the data with different built in and custom methods

```
node demo
```