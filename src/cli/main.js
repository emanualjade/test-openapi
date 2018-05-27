'use strict'

const { exit } = require('process')

const { addErrorHandler } = require('../errors')
const { run } = require('../init')

const { defineCli } = require('./top')
const { parseConfig } = require('./parse')

// Parse CLI arguments then run tasks
const runCli = async function() {
  const yargs = defineCli()
  const config = parseConfig({ yargs })
  await run(config)
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function({ message }) {
  console.error(`Error: ${message}`)

  exit(1)
}

const eRunCli = addErrorHandler(runCli, runCliHandler)

module.exports = {
  runCli: eRunCli,
}
