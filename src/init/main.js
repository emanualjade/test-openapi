'use strict'

const { reduceAsync } = require('../utils')
const { loadConfig, getTasks, loadNormalizedSpec, addDeps } = require('../plugins')
const { getServer } = require('../plugins/config/server')
const { addErrorHandler, topNormalizeHandler } = require('../errors')

const { launchRunner } = require('./runner')

// Main entry point
const runTasks = async function(config) {
  const configA = await runPlugins({ config })

  await launchRunner({ config: configA })

  return { config: configA }
}

const eRunTasks = addErrorHandler(runTasks, topNormalizeHandler)

const runPlugins = function({ config }) {
  return reduceAsync(PLUGINS, runPlugin, config, mergePlugin)
}

const runPlugin = function(config, plugin) {
  return plugin(config)
}

const mergePlugin = function(configA, configB) {
  return { ...configA, ...configB }
}

const PLUGINS = [loadConfig, loadNormalizedSpec, getTasks, getServer, addDeps]

module.exports = {
  runTasks: eRunTasks,
}
