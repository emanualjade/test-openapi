'use strict'

const { parseHelper } = require('../../../helpers')

const helpersHandler = function(error, task, data, { path, pluginsHelpersMap }) {
  const errorA = prependPath({ error, path })
  const errorB = addPlugin({ error: errorA, pluginsHelpersMap })
  throw errorB
}

// Allow prepending a `path` to thrown `error.property`
const prependPath = function({ error, error: { property }, path }) {
  if (path === undefined || property === undefined) {
    return error
  }

  error.property = `${path}.${property}`
  return error
}

// Add `error.module`
const addPlugin = function({ error, error: { value, module }, pluginsHelpersMap }) {
  if (module !== undefined || value === undefined) {
    return error
  }

  const plugin = findPlugin({ value, pluginsHelpersMap })
  if (plugin !== undefined) {
    error.module = `plugin-${plugin[0]}`
  }

  return error
}

// Find the plugin that created this helper (if it's coming from a `plugin.helpers`)
const findPlugin = function({ value, pluginsHelpersMap }) {
  // Should never return `undefined` since `error.value` should always be an helper
  const { name } = parseHelper(value)

  const plugin = Object.entries(pluginsHelpersMap).find(
    ([, pluginsHelpers]) => pluginsHelpers[name] !== undefined,
  )
  return plugin
}

module.exports = {
  helpersHandler,
}
