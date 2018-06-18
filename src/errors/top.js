'use strict'

const { handleBugs } = require('./bug')
const { getPluginName } = require('./plugin')

// Add `error.config` and `error.errors` to every error
// Also mark exceptions that are probably bugs as such
const topLevelHandler = function(error, config = {}) {
  const errorA = Object.assign(error, { config })

  const errorB = handleBugs({ error: errorA })

  errorB.plugin = getPluginName(errorB)

  throw errorB
}

module.exports = {
  topLevelHandler,
}
