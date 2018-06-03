'use strict'

const { exit } = require('process')

const { addErrorHandler } = require('../errors')
const { run } = require('../run')

const { defineCli } = require('./top')
const { parseConfig } = require('./parse')

// Parse CLI arguments then run tasks
const runCli = async function() {
  const yargs = defineCli()
  const config = parseConfig({ yargs })
  const tasks = await run(config)
  return tasks
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function({ plugin, message }) {
  if (CORE_PLUGINS.includes(plugin)) {
    console.error(message)
  }

  exit(1)
}

const CORE_PLUGINS = ['bug', 'config']

const eRunCli = addErrorHandler(runCli, runCliHandler)

module.exports = {
  runCli: eRunCli,
}
