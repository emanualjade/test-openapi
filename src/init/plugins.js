'use strict'

const { get, set, merge } = require('lodash')

const { sortBy, reduceAsync, isObject, validateFromSchema } = require('../utils')
const { addErrorHandler, TestOpenApiError } = require('../errors')
const PLUGINS = require('../plugins')

// Plugins are the way most functionalities is implemented.
// A plugin is a plain object that exports the following properties.

// `plugin.name` `{string}`
// Name of the plugin. Should match the module name, e.g. `test-openapi-plugin-NAME`

// `plugin.dependencies` `{string[]}`
// Other plugins required by this plugin to properly work

// `plugin.overrides` `{string[]}`
// List of plugins that should be disabled if this plugin is used

// `plugin.handlers` `{array}`
// Handlers are the functions fired by each plugin. This is where the logic is.
// The goal of each handler is to usually to modify its input (first argument).
// However it should do so not by mutating its arguments, but by returning
// properties, which will be automatically shallowly merged into the current input.
// Handlers are an array of objects with the following properties.

// `plugin.handlers[*].handler` `{function}`
// Main function fired by the handler

// `plugin.handlers[*].type` `{string}`
// When is the handler fired. Can be:
//   - `start`:
//      - fired before all tasks
//      - arguments: `(config)`
//      - this type of handlers can modify the configuration object
//   - `task`:
//      - fired for each task
//      - arguments: `(task)`
//      - this type of handlers can modify the current task
//      - the task is the same object as the one specified in tasks files
//      - `task` also has the following read-only properties:
//         - `config`: the configuration object (after being modified by the
//           `start` handlers)
//         - `runTask(task)`: function allowing a task to fire another task
//   - `complete`:
//      - fired for each task, but after `task` type.
//      - fired whether `task` has failed or not
//      - arguments: `(task)`
//      - this type of handlers can modify the current `task`
//      - `task` also has the following read-only properties:
//         - `config`: the configuration object (after being modified by the
//           `start` handlers)
//   - `end`:
//      - fired after all tasks
//      - arguments: `({ tasks, config })`
//      - this type of handlers can modify all the final `tasks`
//      - `config` is read-only
// Throwing an exception in:
//  - `start` or `end`: will stop the whole run
//  - `task`: stop the current `task`, but other tasks are still run.
//    Also the current `complete` handlers are still run.
//  - `complete`: stop the current `complete`, but other tasks are still run.

// `plugin.handlers[*].order` `{float}`
// Decides when the handler is fired compared to the other plugins handlers
// of the same `type`. Please look at the current available plugins and try
// to find out where the best place is for your plugin.

// TODO: use `config` instead
const getPluginNames = function() {
  return PLUGINS.map(({ name }) => name)
}

// TODO: use `require()` instead
const getPlugins = function({ pluginNames }) {
  return PLUGINS.filter(({ name }) => pluginNames.includes(name))
}

// Apply plugin-specific configuration
const applyPluginsConfig = function({ config, plugins }) {
  validatePluginsConfig({ config, plugins })
  const configA = applyPluginsDefaults({ config, plugins })
  return configA
}

// Validate plugin-specific configuration
const validatePluginsConfig = function({ config, plugins }) {
  plugins.forEach(plugin => validatePluginConfig({ config, plugin }))
}

const validatePluginConfig = function({ config, plugin: { config: pluginConfig = {}, name } }) {
  Object.entries(pluginConfig).forEach(([propName, { schema }]) =>
    validatePropConfig({ config, propName, schema, name }),
  )
}

const validatePropConfig = function({ config, propName, schema, name }) {
  // Validation not set for that property
  if (!isObject(schema)) {
    return
  }

  const { path, type } = getPropPath({ propName, name })

  VALIDATORS[type]({ config, path, schema })
}

// From `general.example` to `{ path: 'pluginName.example', type: 'general' }`
const getPropPath = function({ propName, name }) {
  const [type, ...propNameA] = propName.split('.')
  const path = [name, ...propNameA].join('.')
  return { path, type }
}

// `plugin.config.general.*` validate against top-level configuration
const validateGeneral = function({ config, path, schema }) {
  validateProp({ value: config, path, schema, name: 'config' })
}

// `plugin.config.task.*` validate against each task
const validateTask = function({ config: { tasks }, path, schema }) {
  tasks.forEach(task => validateProp({ value: task, path, schema, name: 'task' }))
}

const VALIDATORS = {
  general: validateGeneral,
  task: validateTask,
}

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const validateProp = function({ value, path, schema, name }) {
  const valueA = get(value, path)
  if (valueA === undefined) {
    return
  }

  const { error } = validateFromSchema({ schema, value: valueA, name: `${name}.${path}` })
  if (error === undefined) {
    return
  }

  const { taskKey, taskMessage } = getTaskProps({ task: value, name })

  throw new TestOpenApiError(`Configuration ${taskMessage}is invalid: ${error}`, {
    property: path,
    taskKey,
    expected: schema,
    actual: valueA,
  })
}

const getTaskProps = function({ task: { taskKey }, name }) {
  if (name !== 'task') {
    return { taskMessage: '' }
  }

  return { taskKey, taskMessage: `for task '${taskKey}' ` }
}

// Apply plugin-specific configuration default values
const applyPluginsDefaults = function({ config, plugins }) {
  const configA = applyGeneralDefaults({ config, plugins })
  const configB = applyTaskDefaults({ config: configA, plugins })
  return configB
}

const applyGeneralDefaults = function({ config, plugins }) {
  const generalDefaults = getPluginsDefaults({ plugins, type: 'general' })
  const configA = merge({}, ...generalDefaults, config)
  return configA
}

const applyTaskDefaults = function({ config, config: { tasks }, plugins }) {
  const taskDefaults = getPluginsDefaults({ plugins, type: 'task' })
  const tasksA = tasks.map(task => merge({}, ...taskDefaults, task))
  return { ...config, tasks: tasksA }
}

const getPluginsDefaults = function({ plugins, type }) {
  const defaultValues = plugins.map(plugin => getPluginDefaults({ plugin, type }))
  const defaultValuesA = [].concat(...defaultValues)
  return defaultValuesA
}

const getPluginDefaults = function({ plugin: { name, config: pluginConfig = {} }, type }) {
  return Object.entries(pluginConfig)
    .filter(configEntry => hasDefaults(type, configEntry))
    .map(configEntry => getDefaults(type, configEntry, name))
}

const hasDefaults = function(type, [configName, { default: defaultValue }]) {
  return configName.startsWith(type) && defaultValue !== undefined
}

const getDefaults = function(type, [configName, { default: defaultValue }], name) {
  const path = configName.replace(type, name)
  return set({}, path, defaultValue)
}

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
  const handlers = plugins.map(plugin => mapHandlers({ plugin, type, errorHandler, readOnlyArgs }))
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
}) {
  return handlers
    .filter(({ type: typeA }) => typeA === type)
    .map(handler => mapHandler({ plugin, handler, errorHandler, readOnlyArgs }))
}

const mapHandler = function({
  plugin: { name },
  handler: { handler, order },
  errorHandler,
  readOnlyArgs,
}) {
  const handlerA = callHandler.bind(null, { handler, readOnlyArgs })
  const handlerB = addErrorHandler(handlerA, pluginErrorHandler.bind(null, name))
  const handlerC = wrapErrorHandler({ handler: handlerB, errorHandler })
  return { handler: handlerC, order }
}

const callHandler = function({ handler, readOnlyArgs }, input, ...args) {
  const inputA = { ...input, ...readOnlyArgs }
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
  getPluginNames,
  getPlugins,
  applyPluginsConfig,
  runHandlers,
}
