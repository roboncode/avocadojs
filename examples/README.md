## Example

The following example showcases a workflow Orango can provide in a Twitter knockoff called "Chirpy". It is composed of a client built with [Vue.js](https://vuejs.org/) and a server built on [Express](https://expressjs.com/).

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


#### Run setup

Open a new terminal in the project directory.

```
yarn examples:setup
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

<img src="https://duaw26jehqd4r.cloudfront.net/items/2y2D202N1n3J3Z1M170s/Image%202018-10-10%20at%209.13.28%20AM.png" width="150">

### Video Tutorials

Coming later...