'use strict'

const { addErrorHandler, BugError } = require('../../../errors')
const { isTemplateName } = require('../../../template')

// Retrieve all `plugin.template`
const getPluginsVars = function({ task, context, context: { _plugins: plugins } }) {
  const pluginsVarsMap = plugins.map(plugin => getPluginVars({ plugin, task, context }))
  const pluginsVarsMapA = Object.assign({}, ...pluginsVarsMap)

  const pluginsVars = Object.assign({}, ...Object.values(pluginsVarsMapA))
  return { pluginsVars, pluginsVarsMap: pluginsVarsMapA }
}

const getPluginVars = function({ plugin, plugin: { name, template }, task, context }) {
  if (template === undefined) {
    return
  }

  const vars = eGetVars({ plugin, task, context })

  validateVarNames({ vars, plugin })

  return { [name]: vars }
}

const getVars = function({ plugin: { template }, task, context }) {
  if (typeof template !== 'function') {
    return template
  }

  const vars = template(task, context)
  return vars
}

// Add `error.message|module` when `plugin.template` throws
const getVarsHandler = function(error, { plugin: { name } }) {
  error.message = `Error while retrieving 'plugin.template': ${error.message}`

  if (error.module === undefined) {
    error.module = `plugin-${name}`
  }

  throw error
}

const eGetVars = addErrorHandler(getVars, getVarsHandler)

// Validate `plugin.template` return value
const validateVarNames = function({ vars, plugin }) {
  Object.keys(vars).forEach(name => validateVarName({ name, plugin }))
}

const validateVarName = function({ name, plugin }) {
  if (isTemplateName({ name })) {
    return
  }

  const module = `plugin-${plugin.name}`
  throw new BugError(
    `'plugin.template' returned a template variable with an invalid name: ${name}`,
    { value: name, module },
  )
}

module.exports = {
  getPluginsVars,
}
