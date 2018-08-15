'use strict'

const { addErrorHandler, BugError } = require('../../../errors')
const { getPath } = require('../../../utils')
const { isTemplateName } = require('../../../template')

const { wrapTemplateVars } = require('./check')

// Retrieve all `plugin.template`
const getPluginsVars = function({ context, context: { _plugins: plugins } }) {
  const pluginsVarsMap = getPluginsVarsMap({ context, plugins })
  const pluginsVars = mergePluginsVars({ plugins, pluginsVarsMap })
  return { pluginsVars, pluginsVarsMap }
}

const getPluginsVarsMap = function({ context, plugins }) {
  const pluginsVarsMap = plugins.map(plugin => getPluginVars({ plugin, context }))
  return Object.assign({}, ...pluginsVarsMap)
}

const getPluginVars = function({ plugin, plugin: { name, template }, context }) {
  if (template === undefined) {
    return
  }

  const vars = eGetVars({ plugin, context })

  validateVarNames({ vars, plugin })

  const varsA = wrapTemplateVars({ vars, plugin })

  return { [name]: varsA }
}

const getVars = function({ plugin: { template }, context }) {
  if (typeof template !== 'function') {
    return template
  }

  const vars = template(context)
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

  const property = getPath(['plugin', 'template', name])
  const module = `plugin-${plugin.name}`
  throw new BugError(
    `'plugin.template' returned a template variable with an invalid name '${name}': it must be prefixed with $$ and only contain letters, digits, underscores and dashes`,
    { value: name, property, module },
  )
}

const mergePluginsVars = function({ plugins, pluginsVarsMap }) {
  // Ensure `plugin.template` merge priority follows `plugins` order
  const pluginsVars = plugins
    .filter(({ name }) => name !== 'template')
    .map(({ name }) => pluginsVarsMap[name])
    .reverse()
  // Core template variables always have least priority
  const pluginsVarsA = Object.assign({}, pluginsVarsMap.template, ...pluginsVars)
  return pluginsVarsA
}

module.exports = {
  getPluginsVars,
}
