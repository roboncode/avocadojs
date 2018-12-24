const fs = require('fs')
const inquirer = require('inquirer')
require('colors')
// const setup = require(__dirname + '/../helpers/setup')

// get sample db
// const db = await setup()

// console.log(files)

function humanize(str) {
  var frags = str.split('_')
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  }
  return frags.join(' ')
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'snippet',
      message: 'Choose a snippet to run:',
      choices() {
        let files = fs.readdirSync(__dirname + '/snippets')
        let choices = []
        for (let i = 0; i < files.length; i++) {
          let option = {
            name: humanize(files[i].replace(/.\w+$/gi, '')),
            value: files[i]
          }
          choices[i] = option
        }
        return choices
      }
    }
  ])
  .then(async answers => {
    const setup = require('./helpers/setup')
    const db = await setup()
    require('./snippets/' + answers.snippet)(db)
  })
