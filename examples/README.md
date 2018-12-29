# Examples

This directory provides a range of examples on how to use Orango.

You will notice that the snippets reference `orango` like so...

```js
module.exports = async ({ orango }) => {
  ...
}
```

This is to separte the model and controller from having to know the instance of 
orango it is using. The orango instance can be managed by your application. This
practice of passing it in allows you to have multiple databases that may share the
same models and is considered best practice.

Of course, how you choose to pass the reference of Orango is up to you. This library
does not force you to setup your project in any certain way. This information is 
provided so you can understand how the examples in this project have been setup.

### How does orango get injected?

There is a helper called `di.js` that injects the Orango reference into the models 
and snippets.

### CLI for examples

You can run the examples from the command line by using

```js
npm run examples
```

or using yarn (if you have yarn installed)

```js
yarn examples
```