**[21 Nov 2018]** 1.0.0-alpha.0 

**[15 Nov 2018]** 0.10.0 release. Scoped required properties added. Regarding `scoped default properties`, see response here https://github.com/roboncode/orango/issues/39

**[14 Nov 2018]** Status update. I am currently working on a few feature items I found were needed when testing in real-world scenarios.

* Support for `scoped required properties`. This will allow you to create schemas that required different properties depending on whether you are creating or updating values. This is probably how it will look once completed...

```js
new Schema({
	name: { type: String, required: true }, // always required
	email: { type: String, required: 'create update' }, // same as true
	created: { type: Date, required: 'create' }, // only on create
	updated: { type: Date, required: 'update' }, // only on update
})
```

**[19 Oct 2018]** 0.9.4 released. Bug fixes. Updates to examples (still in progress). To get the example up and running, refer to the examples `README.md`. The server's controllers and models directories and `app.js` are where Orango is defined and used.

**[08 Oct 2018]** 0.9.3 released. Added authentication for connecting to database. Ability to create new databases with authenticated user. I worked on Edge collections and models and now provide a more streamlined approach with link() and unlink(). Many updates to the examples/server. Working on creating a mock twitter application. Other bug fixes.

*Screenshot of example application (in progress)*

<img src="https://duaw26jehqd4r.cloudfront.net/items/2y2D202N1n3J3Z1M170s/Image%202018-10-10%20at%209.13.28%20AM.png" width="150">


**[03 Oct 2018]** 0.9.0 released. A second iteration of `populate()` is available. In addition, `var()`, `append()` and `merge()` were added. The documentation and examples are really lacking at this point. I am still working on examples and then documentation will follow after the API feels a little less ephemeral. I would not recommend using Orango yet for any real development until I have completed the examples to test the workflow. I am still finding some parts that are missing / or needing refactoring as I am trying to use it.

**[26 Sep 2018]** I am working on fixing the current issues and and continuing on example project. There is quite a bit of refactoring in the latest commits and API changes as the workflow is being evaluated.

**[19 Sept 2018]**  On vacation, thx for the feedback. I will be at it again once I am back.

**[10 Sept 2018]**  I am currently working on an example project. The [example](https://github.com/roboncode/orango/tree/examples) branch will provide an initial use case in a "real-world" application using Express. It also allows me to find missing workflows that are needed for an initial release. One of those features coming down the pipeline is `populate()` - which provides the ability to populate properties from other collections when fetching data.

**[04 Sept 2018]**  I have tests in place currently at [![Coverage Status](https://coveralls.io/repos/github/roboncode/orango/badge.svg?branch=master)](https://coveralls.io/github/roboncode/orango?branch=master)  . I am testing out the API workflow on a test project and then I will working on the documentation. In the meantime, if you are eager to start using Orango, I would recommend looking at the test cases for examples. There are other items on the Roadmap but I am working on a stable 1.0 release
