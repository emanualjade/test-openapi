'use strict'

const { sortBy, reduceAsync } = require('../utils')
const { addErrorHandler } = require('../errors')

// Run plugin `handlers` of a given `type`
// Handlers will reduce over `input`. Their return values gets shallowly merged
// They also receive `readOnlyArgs` as input, but cannot modify it
// An error handler can also be added to every handler
// Handlers can be async
const runHandlers = function(input, plugins, type, readOnlyArgs, errorHandler) {
  const handlers = getHandlers({ plugins, type, readOnlyArgs, errorHandler })

  return reduceAsync(handlers, runHandler, input, mergeReturnValue)
}

const getHandlers = function({ plugins, type, errorHandler, readOnlyArgs }) {
  const handlers = plugins.map(plugin =>
    mapHandlers({ plugin, type, errorHandler, readOnlyArgs, plugins }),
  )
  const handlersA = [].concat(...handlers)

  const handlersB = sortBy(handlersA, 'order')
  const handlersC = handlersB.map(({ handler }) => handler)

  return handlersC
}

const mapHandlers = function({
  plugin: { handlers, ...plugin },
  type,
  errorHandler,
  readOnlyArgs,
  plugins,
}) {
  return handlers
    .filter(({ type: typeA }) => typeA === type)
    .map(handler => mapHandler({ plugin, handler, errorHandler, readOnlyArgs, plugins }))
}

const mapHandler = function({
  plugin: { name },
  handler: { handler, order },
  errorHandler,
  readOnlyArgs,
  plugins,
}) {
  const handlerA = callHandler.bind(null, { handler, readOnlyArgs, plugins })
  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, name))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return { handler: handlerC, order }
}

const callHandler = function({ handler, readOnlyArgs, plugins }, input, ...args) {
  const pluginNames = plugins.map(({ name }) => name)
  const inputA = { ...input, ...readOnlyArgs, pluginNames, plugins }
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
