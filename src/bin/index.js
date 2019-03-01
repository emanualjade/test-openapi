#!/usr/bin/env node
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
const runCliHandler = function({ tasks, message }) {
  // Do not print error message if the error happened during task running, as
  // it's already been reported using `report`
  if (tasks === undefined) {
    // eslint-disable-next-line no-console, no-restricted-globals
    console.error(message)
  }

  exit(1)
}

const eRunCli = addErrorHandler(runCli, runCliHandler)

eRunCli()
