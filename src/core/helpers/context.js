'use strict'

const { substituteHelpers } = require('../../helpers')

const coreHelpers = require('./core')

// Returns `context.helpers()` function available for any `run` handler
const getHelpersFunc = function({
  task: { originalTask },
  context,
  context: { config, startData },
}) {
  // User-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const data = {
    ...coreHelpers,
    ...config.helpers,
    ...startData.helpers,
    ...originalTask.helpers,
  }

  // Helper functions get `context.task` with the original task (before helpers evaluation)
  // not the current task, because it's more predictable for the user.
  const contextA = { ...context, task: originalTask }

  const helpers = contextHelpers.bind(null, data, { context: contextA })
  return helpers
}

const contextHelpers = function(data, opts, value, dataOverride, { path } = {}) {
  return substituteHelpers(value, { ...data, ...dataOverride }, { ...opts, path })
}

module.exports = {
  getHelpersFunc,
}
