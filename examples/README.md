# Example

The following example showcases a workflow Orango can provide in a Twitter knockoff called "Bluebird". It is composed of a client built with [Vue.js](https://vuejs.org/) and a server built on [Express](https://expressjs.com/).

## Pre-requisites

* **[Node.js](https://nodejs.org/en/)** - For the best experience, you should have Node.js 8.10 or higher.

* **[Docker](https://www.docker.com/get-started)** - Used to install an instance of ArangoDB.

* **[Yarn](https://yarnpkg.com/en/)** - An alternate to npm package manager.

## Getting started

### Run an instance of ArangoDB in Docker

```
cd tools
docker-compose up -d
```

### Run an instance of the server

Open a new terminal

```
cd examples/server
yarn
yarn serve
```

### Run an instance of the client

Open a new terminal

```
cd examples/client
yarn
yarn serve
```

The `server` will run on [http://localhost:3000](http://localhost:3000) 

The `client` will run on [http://localhost:8080](http://localhost:8080)

## Screenshots

Below are some examples of the app's interface

<img src="https://duaw26jehqd4r.cloudfront.net/items/2y2D202N1n3J3Z1M170s/Image%202018-10-10%20at%209.13.28%20AM.png" width="150">

## This is just an example

This application is just an example and does not provide a production ready environment, particularly within the realm of authentication. It is meant to just provide a means of understanding how to use Orango in your own application workflow.