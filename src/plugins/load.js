'use strict'

const { uniq } = require('lodash')

const { addErrorHandler, TestOpenApiError } = require('../errors')

// `require()` all the plugins
const loadAllPlugins = function({ plugins = [], loaded = [] }) {
  const pluginsA = loadPlugins({ plugins, loaded })
  return { plugins: pluginsA }
}

const loadPlugins = function({ plugins, loaded }) {
  if (plugins.length === 0) {
    return []
  }

  const parentPlugins = loadParentPlugins({ plugins, loaded })
  const childPlugins = loadChildPlugins({ parentPlugins, loaded })
  return [...parentPlugins, ...childPlugins]
}

const loadParentPlugins = function({ plugins, loaded }) {
  return uniq(plugins)
    .map(plugin => loadPlugin({ plugin, loaded }))
    .filter(plugin => plugin !== undefined)
}

const loadPlugin = function({ plugin, loaded }) {
  const alreadyLoaded = loaded.some(({ name }) => name === plugin)
  if (alreadyLoaded) {
    return
  }

  const pluginA = eRequirePlugin({ plugin })
  return pluginA
}

// TODO: separate plugins in their own node modules instead
const requirePlugin = function({ plugin }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(`../modules/${plugin}`)
}

const requirePluginHandler = function(_, { plugin }) {
  throw new TestOpenApiError(
    `The plugin '${plugin}' is used in the configuration but is not installed. Please run 'npm install test-openapi-plugin-${plugin}'.`,
  )
}

const eRequirePlugin = addErrorHandler(requirePlugin, requirePluginHandler)

// `require()` all the plugins dependencies (from `plugin.dependencies`)
const loadChildPlugins = function({ parentPlugins, loaded }) {
  const dependenciesA = parentPlugins.map(({ dependencies = [] }) => dependencies)
  const dependenciesB = [].concat(...dependenciesA)

  // Make sure dependencies do not require already loaded plugins
  const loadedA = [...loaded, ...parentPlugins]

  // Recursion
  const childPlugins = loadPlugins({ plugins: dependenciesB, loaded: loadedA })
  return childPlugins
}

module.exports = {
  loadAllPlugins,
}
