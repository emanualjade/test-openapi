'use strict'

const { bundleErrors } = require('./bundle')
const { handleBugs } = require('./bug')
const { getPluginName } = require('./plugin')

// Add `error.config` and `error.errors` to every error
// Also mark exceptions that are probably bugs as such
const topLevelHandler = function(error, config = {}) {
  const errorA = Object.assign(error, { config })

  const errorB = bundleSingleError({ error: errorA })

  const errorC = handleBugs({ error: errorB })

  errorC.plugin = getPluginName(errorC)

  throw errorC
}

// Bundle single error with `bundleErrors()` unless it's already bundled
const bundleSingleError = function({ error }) {
  if (error.errors) {
    return error
  }

  return bundleErrors({ errors: [error] })
}

module.exports = {
  topLevelHandler,
}
