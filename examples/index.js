const fs = require('fs')
const inquirer = require('inquirer')
const di = require('./helpers/di')
const config = require('./config')

require('colors')

function humanize(str) {
  var frags = str.split('_')
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  }
  return frags.join(' ')
}

// TODO: ArangoDB URL? (http://localhost:8529)
// TODO: Are you running ArangoDB with credentials? Y/n
// TODO: Root username? (root)
// TODO: Root password? (orango)
// TODO: Remember these settings? Y/n
// You can change these settings anytime in examples/examples.config.js

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
  .then(async ({ snippet }) => {
    if (snippet.match(/connect/gi)) {
      const orango = require('../lib')
      di.injectFile(__dirname + '/snippets/' + snippet, { orango, config })
    } else {
      const setup = require('./helpers/setup')
      const orango = await setup(config)
      di.injectFile(__dirname + '/snippets/' + snippet, { orango, config })
    }
  })
