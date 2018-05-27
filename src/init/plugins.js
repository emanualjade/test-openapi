'use strict'

const { sortBy } = require('../utils')
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

// `plugin.properties.success|error` `{string[]}`
// List of properties returned by a `task` handler that should be exposed to
// the final `task` return value when it is successful or has failed.

// TODO: use `config` instead
const getPluginNames = function() {
  return PLUGINS.map(({ name }) => name)
}

const getPlugins = function({ pluginNames }) {
  const plugins = findPlugins({ pluginNames })
  const handlers = getHandlers({ plugins })
  const properties = getProperties({ plugins })
  return { handlers, properties }
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

const getProperties = function({ plugins }) {
  const properties = PROPERTIES_TYPES.map(type => getPropertiesByType({ type, plugins }))
  const propertiesA = Object.assign({}, ...properties)
  return propertiesA
}

const PROPERTIES_TYPES = ['success', 'error']

const getPropertiesByType = function({ type, plugins }) {
  const propertiesA = plugins.map(({ properties: { [type]: properties = [] } = {} }) => properties)
  const propertiesB = [].concat(...propertiesA)
  return { [type]: propertiesB }
}

module.exports = {
  getPluginNames,
  getPlugins,
}
