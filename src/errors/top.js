'use strict'

const { omit } = require('lodash')

const { bundleErrors } = require('./bundle')
const { handleBugs } = require('./bug')
const { getPluginName } = require('./plugin')

// Add `error.config` and `error.errors` to every error
// Also mark exceptions that are probably bugs as such
const topLevelHandler = function(error, config = {}) {
  const errorA = Object.assign(error, { config })

  const errorB = bundleSingleError({ error: errorA })

  const errorC = handleBugs({ error: errorB })

  const errorD = cleanError({ error: errorC })

  errorD.plugin = getPluginName(errorD)

  throw errorD
}

// Bundle single error with `bundleErrors()` unless it's already bundled
const bundleSingleError = function({ error }) {
  if (error.errors) {
    return error
  }

  return bundleErrors({ errors: [error] })
}

const cleanError = function({ error, error: { errors } }) {
  if (errors === undefined) {
    return error
  }

  error.errors = errors.map(errorObj => omit(errorObj, 'stack'))

  return error
}

module.exports = {
  topLevelHandler,
}
