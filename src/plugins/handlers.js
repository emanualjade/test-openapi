'use strict'

const { reduceAsync } = require('../utils')
const { addErrorHandler } = require('../errors')

// Run plugin `handlers` of a given `type`
// Handlers will reduce over `input`. Their return values gets shallowly merged
// They also receive `readOnlyArgs` as input, but cannot modify it
// An error handler can also be added to every handler
// Handlers can be async
const runHandlers = function({
  type,
  plugins,
  input,
  context,
  errorHandler,
  stopFunc,
  mergeReturn = defaultMergeReturn,
}) {
  const contextA = getContext({ context, plugins })
  const handlers = getHandlers({ plugins, type, errorHandler, context: contextA })

  return reduceAsync(handlers, runHandler, input, mergeReturn, stopFunc)
}

const getContext = function({ context, plugins }) {
  const pluginNames = plugins.filter(({ isCore }) => !isCore).map(({ name }) => name)
  return { ...context, pluginNames, _plugins: plugins }
}

const getHandlers = function({ plugins, type, errorHandler, context }) {
  const handlers = plugins.map(plugin => getPluginHandlers({ plugin, type }))
  const handlersA = [].concat(...handlers)

  const handlersB = handlersA.map(handler => wrapHandler({ handler, errorHandler, context, type }))
  return handlersB
}

const getPluginHandlers = function({ plugin, type }) {
  const handlers = plugin[type]
  if (handlers === undefined) {
    return []
  }

  // `plugin.start|task|complete|end()` can be an array of functions
  // It is useful to make sure some values are assigned to `task.*` even if an
  // error is thrown at the middle of the handler
  const handlersA = Array.isArray(handlers) ? handlers : [handlers]

  const handlersB = handlersA.map(func => getPluginHandler({ func, plugin }))
  return handlersB
}

const getPluginHandler = function({ func, plugin: { isCore, name } }) {
  // `error.plugin` is `core` for core plugins
  const plugin = isCore ? 'core' : name
  return { func, plugin }
}

const wrapHandler = function({ handler: { func, plugin }, errorHandler, context, type }) {
  const handlerA = callHandler.bind(null, { func, context, type })

  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, plugin))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return handlerC
}

const callHandler = function({ func, context }, input) {
  return func(input, context)
}

// Add `error.plugin` to every thrown error
const pluginErrorHandler = function(plugin, error) {
  // Recursive handlers already have `error.plugin` defined
  if (error.plugin === undefined) {
    error.plugin = plugin
  }

  throw error
}

// Extra error handling logic
const wrapErrorHandler = function({ handler, errorHandler }) {
  if (errorHandler === undefined) {
    return handler
  }

  const handlerA = addErrorHandler(handler, errorHandler)
  return handlerA
}

const runHandler = function(input, handler) {
  return handler(input)
}

const defaultMergeReturn = function(input, newInput) {
  return { ...input, ...newInput }
}

module.exports = {
  runHandlers,
}
