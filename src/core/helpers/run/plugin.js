'use strict'

const { addErrorHandler } = require('../../../errors')
const { isHelperName } = require('../../../helpers')

// Retrieve all `plugin.helpers`
const getPluginsHelpers = function({ task, context, context: { _plugins: plugins } }) {
  const pluginsHelpersMap = plugins.map(plugin => getPluginHelpers({ plugin, task, context }))
  const pluginsHelpersMapA = Object.assign({}, ...pluginsHelpersMap)

  const pluginsHelpers = Object.assign({}, ...Object.values(pluginsHelpersMapA))
  return { pluginsHelpers, pluginsHelpersMap: pluginsHelpersMapA }
}

const getPluginHelpers = function({ plugin, plugin: { name, helpers }, task, context }) {
  if (helpers === undefined) {
    return
  }

  const helpersA = eGetHelpers({ plugin, task, context })

  validateHelperNames({ helpers: helpersA, plugin })

  return { [name]: helpersA }
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

// Validate `plugin.helpers` return value
const validateHelperNames = function({ helpers, plugin }) {
  Object.keys(helpers).forEach(name => validateHelperName({ name, plugin }))
}

const validateHelperName = function({ name, plugin }) {
  if (isHelperName({ name })) {
    return
  }

  // Throw a bug error
  const error = new Error(`'plugin.helpers' returned an helper with an invalid name: ${name}`)
  error.module = `plugin-${plugin.name}`
  throw error
}

module.exports = {
  getPluginsHelpers,
}
