const di = require('./helpers/di')
const setup = require('./setup')
const config = require('./config')

async function main() {
  const orango = await setup(config)
  di.injectFile(__dirname + '/snippets/' + process.argv[2], { orango, config })
}

main()
