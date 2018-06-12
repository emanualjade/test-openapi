'use strict'

// Check if a specific plugin is loaded
const hasOptionalDependency = function({ plugins, name: pluginName }) {
  return plugins.some(({ name }) => name === pluginName)
}

module.exports = {
  hasOptionalDependency,
}
