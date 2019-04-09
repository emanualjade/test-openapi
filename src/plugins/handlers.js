import { reduceAsync } from '../utils.js'
import { addErrorHandler } from '../errors.js'

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
  const handlers = getHandlers({
    plugins,
    type,
    errorHandler,
    context: contextA,
  })

  return reduceAsync(handlers, runHandler, {
    prevVal: input,
    secondMapFunc: mergeReturn,
    stopFunc,
  })
}

const getContext = function({ context, plugins }) {
  const pluginNames = plugins.map(({ name }) => name)
  return { ...context, pluginNames, _plugins: plugins }
}

const getHandlers = function({ plugins, type, errorHandler, context }) {
  return plugins
    .flatMap(plugin => getPluginHandlers({ plugin, type }))
    .map(handler => wrapHandler({ handler, errorHandler, context }))
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

const wrapHandler = function({
  handler: { func, name },
  errorHandler,
  context,
}) {
  const handlerA = callHandler.bind(null, { func, context })

  const handlerB = addErrorHandler(
    handlerA,
    pluginErrorHandler.bind(null, name),
  )
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return handlerC
}

const callHandler = function({ func, context }, input) {
  return func(input, context)
}

// Add `error.module` to every thrown error
const pluginErrorHandler = function(name, error) {
  // Recursive handlers already have `error.module` defined
  if (error.module === undefined) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
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
