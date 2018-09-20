const package = require('package')(module)

let program = require('commander')
let command = require('./command')

program
  .version(package.version)
  .usage(`texhub (${Object.keys(command).join("|")})`)
  .parse(process.argv)

const cmd = program.args[0]
if(command[cmd]) {
  main(cmd)
} else {
  console.log('subcommand not found. %j is permitted', Object.keys(command))
}

async function main(cmd) {
  try {
    await command[cmd]()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
