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

  const errorC = addEmptyTasks({ error: errorB })

  const errorD = handleBugs({ error: errorC })

  const errorE = cleanError({ error: errorD })

  errorE.plugin = getPluginName(errorE)

  throw errorE
}

// Bundle single error with `bundleErrors()` unless it's already bundled
const bundleSingleError = function({ error }) {
  if (error.errors) {
    return error
  }

  return bundleErrors({ errors: [error] })
}

// If the error was thrown before tasks run, `error.tasks` should be `[]`
const addEmptyTasks = function({ error, error: { tasks = [] } }) {
  Object.assign(error, { tasks })

  return error
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
