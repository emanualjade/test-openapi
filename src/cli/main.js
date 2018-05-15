'use strict'

const { exit } = require('process')

const { addErrorHandler } = require('../errors')

const { defineTopOptions } = require('./top')
const { parseOpts } = require('./parse')
const { COMMANDS } = require('./trigger')

// Parse CLI arguments then run integration tests
const runCli = async function() {
  const yargs = defineTopOptions()
  const { command, opts, posOpts } = parseOpts({ yargs })
  await COMMANDS[command]({ opts, posOpts })
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function({ message }) {
  console.error(`Integration testing failed: ${message}`)

  exit(1)
}

const eRunCli = addErrorHandler(runCli, runCliHandler)

module.exports = {
  runCli: eRunCli,
}
