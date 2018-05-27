'use strict'

const {
  addErrorHandler,
  addGenErrorHandler,
  normalizeError,
  bundleSingleError,
} = require('../errors')
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

// Add `error.config` and `error.errors` to every error
const runHandler = function(error, config = {}) {
  const errorA = normalizeError(error, { config })
  const errorB = bundleSingleError({ error: errorA })
  throw errorB
}

const eRun = addErrorHandler(run, runHandler)

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

const eRunPlugins = addGenErrorHandler(runPlugins, ({ pluginNames }) => ({ plugins: pluginNames }))

module.exports = {
  run: eRun,
}
