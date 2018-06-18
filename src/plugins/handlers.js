'use strict'

const { reduceAsync } = require('../utils')
const { addErrorHandler } = require('../errors')

// Run plugin `handlers` of a given `type`
// Handlers will reduce over `input`. Their return values gets shallowly merged
// They also receive `readOnlyArgs` as input, but cannot modify it
// An error handler can also be added to every handler
// Handlers can be async
const runHandlers = function(
  type,
  plugins,
  input,
  context,
  advancedContext,
  errorHandler,
  stopFunc,
) {
  const args = getArgs({ plugins, context, advancedContext })
  const handlers = getHandlers({ plugins, type, errorHandler, args })

  return reduceAsync(handlers, runHandler, input, mergeReturnValue, stopFunc)
}

const getArgs = function({ plugins, context, advancedContext }) {
  const pluginNames = plugins.map(({ name }) => name)
  return [{ ...context, pluginNames }, { ...advancedContext, plugins }]
}

const getHandlers = function({ plugins, type, errorHandler, args }) {
  return plugins
    .map(plugin => getHandler({ plugin, type, errorHandler, args }))
    .filter(handler => handler !== undefined)
}

const getHandler = function({ plugin, plugin: { name }, type, errorHandler, args }) {
  const handler = plugin[type]
  if (handler === undefined) {
    return
  }

  const handlerA = callHandler.bind(null, { handler, args })

  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, name))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return handlerC
}

const callHandler = function({ handler, args }, input) {
  return handler(input, ...args)
}

// Add `error.plugin` to every thrown error
const pluginErrorHandler = function(name, error) {
  // Recursive handlers already have `error.plugin` defined
  if (error.plugin === undefined) {
    error.plugin = name
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

const mergeReturnValue = function(input, newInput) {
  return { ...input, ...newInput }
}

module.exports = {
  runHandlers,
}
