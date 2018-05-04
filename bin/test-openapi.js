#!/usr/bin/env node
'use strict'

const { exit } = require('process')

const { runCli } = require('../src')

const printError = function(error) {
  console.error(error)
  exit(1)
}

runCli().catch(printError)

module.exports = {
  runCli,
}
