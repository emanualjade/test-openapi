'use strict'

const { addErrorHandler, topLevelHandler } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')

const { getPluginNames, getPlugins, applyPluginsConfig, runHandlers } = require('./plugins')
const { launchRunner } = require('./runner')
const { runTask } = require('./run')

// Main entry point
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const pluginNames = getPluginNames({ config: configB })

  await eRunPlugins({ config: configB, pluginNames })
}

const eRun = addErrorHandler(run, topLevelHandler)

const runPlugins = async function({ config, pluginNames }) {
  const plugins = getPlugins({ pluginNames })

  const configA = { ...config, runTask }

  const configB = applyPluginsConfig({ config: configA, plugins })

  const {
    handlers: { start: handlers },
  } = plugins
  const configC = await runHandlers(configB, handlers)

  await launchRunner({ config: configC, plugins })
}

const runPluginsHandler = function(error, { pluginNames }) {
  error.plugins = pluginNames
  throw error
}

const eRunPlugins = addErrorHandler(runPlugins, runPluginsHandler)

// The following plugins can be run (order in parenthesis).
// `start`, i.e. before any tasks:
//   - `glob` (100): merge tasks whose name include globbing matching other task names.
//   - `call` (110): normalize `task.call.*` object to an array
//   - `validate` (120): normalize `task.validate.*`
//   - `spec` (130): parse, validate and normalize an OpenAPI specification
//   - `generate` (140): normalize and validate `task.call.*` JSON schemas
//   - `dry` (150): `config.dry: true` makes everything stop just before the
//     first task run
//   - `repeat` (160): repeat each task `config.repeat` times
// `task`, i.e. for each task:
//   - `deps` (100): replace all `deps`, i.e. references to other tasks
//   - `spec` (110): merge OpenAPI specification to `task.call.*`
//   - `generate` (120): generates random values based on `task.call.*`
//     JSON schemas
//   - `format` (130): stringify request parameters
//   - `url` (140): build request URL from request parameters
//   - `call` (150): fire actual HTTP call
//   - `format` (160): parse response
//   - `spec` (170): merge OpenAPI specification to `task.validate.*`
//   - `validate` (180): validate response against `task.validate.*` JSON schemas

module.exports = {
  run: eRun,
}
