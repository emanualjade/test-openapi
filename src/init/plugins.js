'use strict'

const { get, has, merge } = require('lodash')

const { sortBy, reduceAsync } = require('../utils')
const { addErrorHandler } = require('../errors')
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
//         - `tasks`: array of all tasks
//         - `runTask(task)`: function allowing a task to fire another task
//   - `complete`:
//      - fired for each task, but after `task` type.
//      - fired whether `task` has failed or not
//      - arguments: `({ task, config })`
//      - this type of handlers can modify the current `task`
//      - `config` is read-only
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

const getPlugins = function({ pluginNames }) {
  const plugins = findPlugins({ pluginNames })
  const handlers = getHandlers({ plugins })
  const defaults = getDefaults({ plugins })
  return { handlers, defaults }
}

// TODO: use `require()` instead
const findPlugins = function({ pluginNames }) {
  return PLUGINS.filter(({ name }) => pluginNames.includes(name))
}

const getHandlers = function({ plugins }) {
  const handlers = deepGetObject(plugins, 'handlers')
  const handlersA = Object.entries(handlers).map(mapHandlers)
  const handlersB = [].concat(...handlersA)

  const handlersC = PLUGIN_TYPES.map(type => getHandlersByType({ type, handlers: handlersB }))
  const handlersD = Object.assign({}, ...handlersC)

  return handlersD
}

const mapHandlers = function([pluginName, handlers]) {
  return handlers.map(handler => ({ ...handler, pluginName }))
}

const PLUGIN_TYPES = ['start', 'task', 'complete', 'end']

const getHandlersByType = function({ type, handlers }) {
  const handlersC = handlers.filter(({ type: typeA }) => typeA === type)
  const handlersD = sortBy(handlersC, 'order')
  const handlersE = handlersD.map(getHandler)
  return { [type]: handlersE }
}

const getHandler = function({ handler, pluginName }) {
  return addErrorHandler(handler, pluginErrorHandler.bind(null, pluginName))
}

// Add `error.plugin` to every thrown error
const pluginErrorHandler = function(pluginName, error) {
  error.plugin = pluginName
  throw error
}

const getDefaults = function({ plugins }) {
  const general = deepGetObject(plugins, 'defaults.general')
  const task = deepGetObject(plugins, 'defaults.task')
  return { general, task }
}

// From array of `{ name, ...object }` to `{ [name]: object[prop], ... }`
const deepGetObject = function(array, prop) {
  const values = array
    .filter(object => has(object, prop))
    .map(({ name, ...object }) => ({ [name]: get(object, prop) }))
  const valuesA = Object.assign({}, ...values)
  return valuesA
}

// Apply plugin-specific configuration
const applyPluginsConfig = function({ config, plugins }) {
  const configA = applyPluginsDefaults({ config, plugins })
  return configA
}

// Apply plugin-specific configuration default values
const applyPluginsDefaults = function({
  config,
  config: { tasks },
  plugins: {
    defaults: { general: generalDefaults, task: taskDefaults },
  },
}) {
  const configA = merge({}, generalDefaults, config)

  const tasksA = tasks.map(task => merge({}, taskDefaults, task))
  const configB = { ...configA, tasks: tasksA }

  return configB
}

const runHandlers = function(input, handlers) {
  return reduceAsync(handlers, runHandler, input, mergeReturnValue)
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
