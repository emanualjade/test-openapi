'use strict'

const { reduceAsync } = require('../utils')
const { addErrorHandler } = require('../errors')

// Run plugin `handlers` of a given `type`
// Handlers will reduce over `input`. Their return values gets shallowly merged
// They also receive `readOnlyArgs` as input, but cannot modify it
// An error handler can also be added to every handler
// Handlers can be async
const runHandlers = function(input, plugins, type, readOnlyArgs, errorHandler, stopFunc) {
  const handlers = getHandlers({ plugins, type, readOnlyArgs, errorHandler })

  return reduceAsync(handlers, runHandler, input, mergeReturnValue, stopFunc)
}

const getHandlers = function({ plugins, type, errorHandler, readOnlyArgs }) {
  return plugins
    .map(plugin => getHandler({ plugin, type, errorHandler, readOnlyArgs, plugins }))
    .filter(handler => handler !== undefined)
}

const getHandler = function({
  plugin,
  plugin: { name },
  type,
  errorHandler,
  readOnlyArgs,
  plugins,
}) {
  const handler = plugin[type]
  if (handler === undefined) {
    return
  }

  const handlerA = callHandler.bind(null, { handler, readOnlyArgs, plugins })
  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, name))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return handlerC
}

const callHandler = function({ handler, readOnlyArgs, plugins }, input, ...args) {
  const inputA = { ...input, ...readOnlyArgs, plugins }
  const maybePromise = handler(inputA, ...args)
  return maybePromise
}

// Add `error.plugin` to every thrown error
const pluginErrorHandler = function(name, error) {
  error.plugin = name
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
