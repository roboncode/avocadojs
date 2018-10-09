## Example

The following example showcases a workflow Orango can provide in a Twitter knockoff called "Bluebird". It is composed of a client built with [Vue.js](https://vuejs.org/) and a server built on [Express](https://expressjs.com/).

### Pre-requisites

* **[Node.js](https://nodejs.org/en/)** - For the best experience, you should have Node.js 8.10 or higher.

* **[Docker](https://www.docker.com/get-started)** - Used to install an instance of ArangoDB.

* **[Yarn](https://yarnpkg.com/en/)** - An alternate to npm package manager.

### Getting started

The following command are located in `package.json`. If the commands do not work, look at the `scripts` section and you can run them manually.

#### Run an instance of ArangoDB in Docker

```
yarn examples:arango
```
#### Setup client & server

```
yarn examples:setup
```


#### Run an instance of the server

Open a new terminal in the project directory.

```
yarn examples:server
```

#### Run an instance of the client

Open a new terminal in the project directory.

```
yarn examples:client
```
The `client` runs on [http://localhost:8080](http://localhost:8080)

The `server` runs on [http://localhost:3000](http://localhost:3000) 

### Screenshots

Below are some examples of the app's interface

<img src="https://dzwonsemrish7.cloudfront.net/items/343x3W1d3N0Z2S3m0L2S/%5B6710066b31e6ae7c9fd35a278bc86002%5D_bluebird.png" width="150">

### Video Tutorials

Coming later...