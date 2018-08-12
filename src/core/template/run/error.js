'use strict'

const { parseTemplate } = require('../../../template')

const templateHandler = function(error, task, vars, { pluginsVarsMap }) {
  if (error.property !== undefined) {
    error.property = `task.${error.property}`
  }

  const errorA = addPlugin({ error, pluginsVarsMap })
  throw errorA
}

// Add `error.module`
const addPlugin = function({ error, error: { value, module }, pluginsVarsMap }) {
  if (module !== undefined || value === undefined) {
    return error
  }

  const plugin = findPlugin({ value, pluginsVarsMap })
  if (plugin !== undefined) {
    error.module = `plugin-${plugin[0]}`
  }

  return error
}

// Find the plugin that created this template variable (if it's coming from a
// `plugin.template`)
const findPlugin = function({ value, pluginsVarsMap }) {
  // Should never return `undefined` since `error.value` should always be a template
  const { name } = parseTemplate(value)

  const plugin = Object.entries(pluginsVarsMap).find(([, pluginsVars]) =>
    pluginsVars.propertyIsEnumerable(name),
  )
  return plugin
}

module.exports = {
  templateHandler,
}
