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

module.exports = {
  run: eRun,
}
