'use strict'

const { reduceAsync } = require('../utils')
const { addErrorHandler, addGenErrorHandler, topNormalizeHandler } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')

const { getPluginNames, getPlugins } = require('./plugins')
const { launchRunner } = require('./runner')
const { runTask } = require('./run')

// Main entry point
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const pluginNames = getPluginNames({ config: configB })

  await eRunPlugins({ config: configB, pluginNames })
}

const eRun = addErrorHandler(run, topNormalizeHandler)

const runPlugins = async function({ config, pluginNames }) {
  const plugins = getPlugins({ pluginNames })

  const configA = { ...config, runTask }

  const configB = await runStartPlugins({ config: configA, plugins })

  await launchRunner({ config: configB, plugins })
}

const eRunPlugins = addGenErrorHandler(runPlugins, ({ pluginNames }) => ({ plugins: pluginNames }))

const runStartPlugins = function({
  config,
  plugins: {
    handlers: { start: startHandlers },
  },
}) {
  return reduceAsync(startHandlers, runPlugin, config, mergePlugin)
}

const runPlugin = function(config, plugin) {
  return plugin(config)
}

const mergePlugin = function(configA, configB) {
  return { ...configA, ...configB }
}

module.exports = {
  run: eRun,
}
