'use strict'

const { reduceAsync } = require('../utils')
const {
  loadConfig,
  getTasks,
  mergeGlobTasks,
  normalizeParams,
  normalizeGenerate,
  normalizeValidate,
  loadNormalizedSpec,
  handleDryRun,
} = require('../plugins')
const { addErrorHandler, topNormalizeHandler } = require('../errors')

const { launchRunner } = require('./runner')
const { runTasks } = require('./run')

// Main entry point
const run = async function(config) {
  const configA = { ...config, runTasks }

  const configB = await runPlugins({ config: configA })

  await launchRunner({ config: configB })
}

const eRun = addErrorHandler(run, topNormalizeHandler)

const runPlugins = function({ config }) {
  return reduceAsync(PLUGINS, runPlugin, config, mergePlugin)
}

const runPlugin = function(config, plugin) {
  return plugin(config)
}

const mergePlugin = function(configA, configB) {
  return { ...configA, ...configB }
}

const PLUGINS = [
  loadConfig,
  getTasks,
  mergeGlobTasks,
  normalizeParams,
  normalizeGenerate,
  normalizeValidate,
  loadNormalizedSpec,
  handleDryRun,
]

module.exports = {
  run: eRun,
}
