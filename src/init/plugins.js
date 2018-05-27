'use strict'

const { sortBy } = require('../utils')
const PLUGINS = require('../plugins')

// TODO: use `config` instead
const getPluginNames = function() {
  return PLUGINS.map(({ name }) => name)
}

const getPlugins = function({ pluginNames }) {
  const plugins = findPlugins({ pluginNames })
  const handlers = getHandlers({ plugins })
  return { handlers }
}

// TODO: use `require()` instead
const findPlugins = function({ pluginNames }) {
  return PLUGINS.filter(({ name }) => pluginNames.includes(name))
}

const getHandlers = function({ plugins }) {
  const handlersA = plugins.map(({ handlers }) => handlers)
  const handlersB = [].concat(...handlersA)

  const handlersC = PLUGIN_TYPES.map(type => getHandlersByType({ type, handlers: handlersB }))
  const handlersD = Object.assign({}, ...handlersC)

  return handlersD
}

const PLUGIN_TYPES = ['start', 'task', 'complete', 'end']

const getHandlersByType = function({ type, handlers }) {
  const handlersC = handlers.filter(({ type: typeA }) => typeA === type)
  const handlersD = sortBy(handlersC, 'order')
  const handlersE = handlersD.map(({ handler }) => handler)
  return { [type]: handlersE }
}

module.exports = {
  getPluginNames,
  getPlugins,
}
