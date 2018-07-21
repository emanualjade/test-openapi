'use strict'

// Retrieve all `plugin.helpers`
const getPluginsHelpers = function({ plugins, task, context }) {
  const pluginHelpers = plugins.map(plugin => getPluginHelper({ plugin, task, context }))
  const pluginHelpersA = Object.assign({}, ...pluginHelpers)
  return pluginHelpersA
}

const getPluginHelper = function({ plugin: { helpers }, task, context }) {
  if (helpers === undefined) {
    return
  }

  if (typeof helpers !== 'function') {
    return helpers
  }

  const helpersA = helpers(task, context)
  return helpersA
}

module.exports = {
  getPluginsHelpers,
}
