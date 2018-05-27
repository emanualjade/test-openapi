'use strict'

const { reduceAsync } = require('../utils')
const {
  config,
  tasks,
  glob,
  spec,
  generate,
  request,
  validate,
  dry,
  repeat,
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
  config.loadConfig,
  tasks.getTasks,
  glob.mergeGlobTasks,
  request.normalizeParams,
  validate.normalizeValidate,
  spec.loadNormalizedSpec,
  generate.normalizeGenerate,
  dry.handleDryRun,
  repeat.repeatTasks,
]

module.exports = {
  run: eRun,
}
