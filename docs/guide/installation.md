# Installation

## Pre-requisites

- [Node.js](https://nodejs.org)
- Running instance of ArangoDB

If you have docker installed you can quickly run an instance 

```sh
unix> docker run -e ARANGO_NO_AUTH=1 -p 8529:8529 -d arangodb@3.4.1
```

## Adding Orango to your project

Orango can be installed using [NPM](https://www.npmjs.com/).

Run this in the terminal in your project folder:

### NPM

``` bash
$ npm i orango --save
```

### Yarn

``` bash
$ yarn add orango
```

### Importing

```js
// Using Node.js `require()`
const orango = require('orango')

// Using ES6 imports
import orango from 'orango'
```
