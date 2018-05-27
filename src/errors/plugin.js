'use strict'

// Retrieve `error.plugin`
const getPluginName = function({ plugin = DEFAULT_PLUGIN }) {
  return plugin
}

// Default `error.plugin` (i.e. when it is not a plugin error nor a bug) is `config`
const DEFAULT_PLUGIN = 'config'

module.exports = {
  getPluginName,
  DEFAULT_PLUGIN,
}
