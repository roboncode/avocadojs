const di = require('./helpers/di')
const setup = require('./helpers/setup')

async function main() {
  const orango = await setup()
  di.injectFile(__dirname + '/snippets/' + process.argv[2], { orango })
}

main()
