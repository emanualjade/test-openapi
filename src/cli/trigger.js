'use strict'

const { runIntegration } = require('../run')

// Command `test-openapi run`
const run = async function({ opts, posOpts }) {
  const optsA = { ...opts, tests: posOpts }
  await runIntegration(optsA)
}

const COMMANDS = {
  run,
}

module.exports = {
  COMMANDS,
}
