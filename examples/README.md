## Example

The following example showcases the workflow Orango can provide to an application. I have create a simplified version of Twitter called "Chirpy". It is composed of a client built with [Vue.js](https://vuejs.org/) and a server built on [Express](https://expressjs.com/).

### Pre-requisites

* **[Node.js](https://nodejs.org/en/)** - For the best experience, you should have Node.js 8.10 or higher.

* **[Docker](https://www.docker.com/get-started)** - Used to install an instance of ArangoDB.

* **[Yarn](https://yarnpkg.com/en/)** - An alternate to npm package manager.

### Getting started

The following command are located in `package.json`. If the commands do not work, look at the `scripts` section and you can run them manually.

#### Run setup

* Installs the dependencies needed by the client and the server
* Creates a Docker instance of ArangoDB called "chirpy" (running on http://localhost:10529)
* Creates a database called "chirpy" 
* Creates a user called "admin" with administrator rights to the "chirpy" database. 
* Populates the database with some sample data.

```
$ yarn examples:setup
```

#### Run server

```
yarn examples:server
```

#### Run web client

```
yarn examples:client
```

### Screenshots

Below are some examples of the app's interface

<img src="https://duaw26jehqd4r.cloudfront.net/items/2y2D202N1n3J3Z1M170s/Image%202018-10-10%20at%209.13.28%20AM.png" width="150">

### Video Tutorials

Coming later...