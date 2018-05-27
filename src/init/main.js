'use strict'

const { addErrorHandler, topLevelHandler } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')
const { getPlugins, runHandlers } = require('../plugins')

const { launchRunner } = require('./runner')
const { runTask } = require('./run')

// Main entry point
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const { config: configC, plugins } = getPlugins({ config: configB })

  await eRunPlugins({ config: configC, plugins })
}

const eRun = addErrorHandler(run, topLevelHandler)

const runPlugins = async function({ config, plugins }) {
  const configA = { ...config, runTask }

  const configC = await runHandlers(configA, plugins, 'start')

  await launchRunner({ config: configC, plugins })
}

const runPluginsHandler = function(error, { plugins }) {
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const eRunPlugins = addErrorHandler(runPlugins, runPluginsHandler)

// The following plugins can be run (order in parenthesis).
// `start`, i.e. before any tasks:
//   - `glob` (1000): merge tasks whose name include globbing matching other task names.
//   - `call` (1100): normalize `task.call.*` object to an array
//   - `validate` (1200): normalize `task.validate.*`
//   - `spec` (1300): parse, validate and normalize an OpenAPI specification
//   - `generate` (1400): normalize and validate `task.call.*` JSON schemas
//   - `dry` (1500): `config.dry: true` makes everything stop just before the
//     first task run
//   - `repeat` (1600): repeat each task `config.repeat` times
// `task`, i.e. for each task:
//   - `deps` (1000): replace all `deps`, i.e. references to other tasks
//   - `spec` (1100): merge OpenAPI specification to `task.call.*`
//   - `generate` (1200): generates random values based on `task.call.*`
//     JSON schemas
//   - `format` (1300): stringify request parameters
//   - `url` (1400): build request URL from request parameters
//   - `call` (1500): fire actual HTTP call
//   - `format` (1600): parse response
//   - `spec` (1700): merge OpenAPI specification to `task.validate.*`
//   - `validate` (1800): validate response against `task.validate.*` JSON schemas

module.exports = {
  run: eRun,
}
