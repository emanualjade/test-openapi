import { reduceAsync } from '../utils/reduce.js'

// Run plugin `handlers` of a given `type`
// Handlers will reduce over `input`. Their return values gets shallowly merged
// They also receive `readOnlyArgs` as input, but cannot modify it
// An error handler can also be added to every handler
// Handlers can be async
export const runHandlers = function({
  type,
  plugins,
  input,
  context,
  onError,
  stopFunc,
  mergeReturn = defaultMergeReturn,
}) {
  const contextA = getContext({ context, plugins })
  const handlers = getHandlers({ plugins, type, onError, context: contextA })

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

const getHandlers = function({ plugins, type, onError, context }) {
  return plugins
    .flatMap(plugin => getPluginHandlers({ plugin, type }))
    .map(handler => callHandler.bind(null, { handler, onError, context }))
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

const callHandler = async function(
  { handler: { func, name }, onError, context },
  input,
) {
  try {
    return await func(input, context)
  } catch (error) {
    pluginErrorHandler({ name, error, input, onError })
  }
}

// Add `error.module` to every thrown error
const pluginErrorHandler = function({ name, error, input, onError }) {
  // Recursive handlers already have `error.module` defined
  if (error.module === undefined) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    error.module = `plugin-${name}`
  }

  if (onError !== undefined) {
    onError(error, input)
  }

  throw error
}

const runHandler = function(input, handler) {
  return handler(input)
}

const defaultMergeReturn = function(input, newInput) {
  return { ...input, ...newInput }
}
