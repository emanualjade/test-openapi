'use strict'

const { omitBy, mapValues } = require('lodash')

const { reduceAsync, promiseThen, isObject } = require('../utils')
const { addErrorHandler } = require('../errors')
const { checkJson } = require('../validation')

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
  json = false,
}) {
  const contextA = getContext({ context, plugins })
  const handlers = getHandlers({ plugins, type, errorHandler, context: contextA, json })

  return reduceAsync(handlers, runHandler, input, mergeReturn, stopFunc)
}

const getContext = function({ context, plugins }) {
  const pluginNames = plugins.map(({ name }) => name)
  return { ...context, pluginNames, _plugins: plugins }
}

const getHandlers = function({ plugins, type, errorHandler, context, json }) {
  const handlers = plugins.map(plugin => getPluginHandlers({ plugin, type }))
  const handlersA = [].concat(...handlers)

  const handlersB = handlersA.map(handler => wrapHandler({ handler, errorHandler, context, json }))
  return handlersB
}

const getPluginHandlers = function({ plugin, plugin: { name }, type }) {
  const handlers = plugin[type]
  if (handlers === undefined) {
    return []
  }

  // `plugin.start|task|complete|end()` can be an array of functions
  // It is useful to make sure some values are assigned to `task.*` even if an
  // error is thrown at the middle of the handler
  const handlersA = Array.isArray(handlers) ? handlers : [handlers]

  const handlersB = handlersA.map(func => ({ func, name }))
  return handlersB
}

const wrapHandler = function({ handler: { func, name }, errorHandler, context, json }) {
  const handlerA = callHandler.bind(null, { func, context, name, json })

  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, name))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return handlerC
}

const callHandler = function({ func, context, name, json }, input) {
  const value = func(input, context)
  return promiseThen(value, valueA => handleReturn({ value: valueA, name, json }))
}

const handleReturn = function({ value, name, json }) {
  const valueA = removeUndefined(value)

  validateJson({ value: valueA, name, json })

  return valueA
}

const removeUndefined = function(value) {
  if (isObject(value)) {
    const valueA = omitBy(value, prop => prop === undefined)
    return mapValues(valueA, removeUndefined)
  }

  if (Array.isArray(value)) {
    const valueA = value.filter(prop => prop !== undefined)
    return valueA.map(removeUndefined)
  }

  return value
}

// Make sure each handler returns only JSON
const validateJson = function({ value, name, json }) {
  if (!json || value === undefined) {
    return
  }

  const getError = getJsonError.bind(null, name)
  checkJson({ value, getError })
}

// Throw a `bug` error
const getJsonError = function(name, message) {
  return new Error(`The '${name}' plugin returned non-JSON properties${message}`)
}

// Add `error.module` to every thrown error
const pluginErrorHandler = function(name, error) {
  // Recursive handlers already have `error.module` defined
  if (error.module === undefined) {
    error.module = `plugin-${name}`
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
