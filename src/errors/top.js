'use strict'

const { normalizeError } = require('./normalize')

// Make sure every top-level exception has an `errors` property
const topNormalizeHandler = function(error, config = {}) {
  // Add `error.config` to every error
  const errorA = normalizeError({ error, properties: { config } })
  if (Array.isArray(errorA.errors)) {
    throw errorA
  }

  // If only one error was thrown, use it in `errors`
  // Convert to plain object and make a shallow copy to avoid circular references
  const errorB = { ...errorA, message: errorA.message }
  // Make it the same shape as errors throw during task running
  errorA.errors = [errorB]

  throw errorA
}

module.exports = {
  topNormalizeHandler,
}
