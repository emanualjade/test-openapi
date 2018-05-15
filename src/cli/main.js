'use strict'

const { exit } = require('process')

const { defineTopOptions } = require('./top')
const { parseOpts } = require('./parse')
const { COMMANDS } = require('./trigger')

// Parse CLI arguments then run integration tests
const runCli = async function() {
  try {
    const yargs = defineTopOptions()
    const { command, opts, posOpts } = parseOpts({ yargs })
    await COMMANDS[command]({ opts, posOpts })
  } catch (error) {
    cliErrorHandler({ error })
  }
}

// If an error is thrown, print error's description, then exit with exit code 1
const cliErrorHandler = function({ error: { message } }) {
  console.error(`Integration testing failed: ${message}`)

  exit(1)
}

module.exports = {
  runCli,
}
