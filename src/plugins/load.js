'use strict'

const { uniq } = require('lodash')

const { addErrorHandler, TestOpenApiError } = require('../errors')

// `require()` all the plugins
const loadAllPlugins = function({ plugins }) {
  const pluginsA = uniq(plugins)
  const pluginsB = pluginsA.map(eRequirePlugin)
  return { plugins: pluginsB }
}

// TODO: separate plugins in their own node modules instead
const requirePlugin = function(name) {
  // eslint-disable-next-line import/no-dynamic-require
  const plugin = require(`../modules/${name}`)
  return { ...plugin, name }
}

const requirePluginHandler = function(_, { plugin }) {
  throw new TestOpenApiError(
    `The plugin '${plugin}' is used in the configuration but is not installed. Please run 'npm install test-openapi-plugin-${plugin}'.`,
  )
}

const eRequirePlugin = addErrorHandler(requirePlugin, requirePluginHandler)

module.exports = {
  loadAllPlugins,
}
