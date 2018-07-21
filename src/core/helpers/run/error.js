'use strict'

// Allow prepending a `path` to thrown `error.property`
const helpersHandler = function(error, data, opts, value, dataOverride, { path } = {}) {
  const errorA = prependPath({ error, path })
  throw errorA
}

const prependPath = function({ error, error: { property }, path }) {
  if (path === undefined || property === undefined) {
    return error
  }

  error.property = `${path}.${property}`
  return error
}

module.exports = {
  helpersHandler,
}
