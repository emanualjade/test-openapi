import { parseTemplate } from '../../../template/parse.js'

// Make it work with `Object.create(null)`
// eslint-disable-next-line no-shadow
const { propertyIsEnumerable } = Object.prototype

export const templateHandler = function(error, { pluginsVarsMap }) {
  if (error.property !== undefined) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    error.property = `task.${error.property}`
  }

  const errorA = addPlugin({ error, pluginsVarsMap })
  throw errorA
}

// Add `error.module`
const addPlugin = function({ error, error: { value }, pluginsVarsMap }) {
  if (error.module !== undefined || value === undefined) {
    return error
  }

  const plugin = findPlugin({ value, pluginsVarsMap })

  if (plugin !== undefined) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    error.module = `plugin-${plugin[0]}`
  }

  return error
}

// Find the plugin that created this template variable (if it's coming from a
// `plugin.template`)
const findPlugin = function({ value: { template }, pluginsVarsMap }) {
  // Should never return `undefined` since `error.value` should always be a
  // template
  const { name } = parseTemplate(template)

  const plugin = Object.entries(pluginsVarsMap).find(([, pluginsVars]) =>
    propertyIsEnumerable.call(pluginsVars, name),
  )
  return plugin
}
