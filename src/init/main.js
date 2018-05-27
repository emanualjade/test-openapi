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
  repeatTasks,
} = require('../plugins')
const { addErrorHandler, topNormalizeHandler } = require('../errors')

const { launchRunner } = require('./runner')
const { runTask } = require('./run')

// Main entry point
const run = async function(config) {
  const configA = { ...config, runTask }

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
  normalizeValidate,
  loadNormalizedSpec,
  normalizeGenerate,
  handleDryRun,
  repeatTasks,
]

module.exports = {
  run: eRun,
}
