'use strict'

const { addErrorHandler } = require('../../../errors')

// Retrieve all `plugin.helpers`
const getPluginsHelpers = function({ plugins, task, context }) {
  const pluginHelpers = plugins.map(plugin => getPluginHelpers({ plugin, task, context }))
  const pluginHelpersA = Object.assign({}, ...pluginHelpers)
  return pluginHelpersA
}

const getPluginHelpers = function({ plugin, plugin: { helpers }, task, context }) {
  if (helpers === undefined) {
    return
  }

  const helpersA = eGetHelpers({ plugin, task, context })
  return helpersA
}

const getHelpers = function({ plugin: { helpers }, task, context }) {
  if (typeof helpers !== 'function') {
    return helpers
  }

  const helpersA = helpers(task, context)
  return helpersA
}

// Add `error.message|module` when `plugin.helpers` throws
const getHelpersHandler = function(error, { plugin: { name } }) {
  error.message = `Error while retrieving 'plugin.helpers': ${error.message}`

  if (error.module === undefined) {
    error.module = `plugin-${name}`
  }

  throw error
}

const eGetHelpers = addErrorHandler(getHelpers, getHelpersHandler)

module.exports = {
  getPluginsHelpers,
}
