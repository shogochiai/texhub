const package = require('package')(module)

let program = require('commander')
let command = require('./command')

program
  .version(package.version)
  .usage(`blankpaper (${Object.keys(command).join("|")})`)
  .parse(process.argv)

if(command[program.args[0]]) command[program.args[0]]()
else console.log('subcommand not found. %j is permitted', Object.keys(command))
