'use strict'

const { getConfigPlugins } = require('./config')
const { loadAllPlugins } = require('./load')
const { validateExports } = require('./exports')
const { removeOverrides } = require('./overrides')
const { validateMissingPlugins } = require('./missing')
const { validatePluginsConfig } = require('./validate')
const { applyPluginsDefaults } = require('./defaults')

// Find all plugins
// Also validate their configuration and apply their defaults to the configuration
const getPlugins = function({ config }) {
  return REDUCERS.reduce(applyReducer, { config })
}

const applyReducer = function(input, reducer) {
  const output = reducer(input)
  return { ...input, ...output }
}

const REDUCERS = [
  getConfigPlugins,
  loadAllPlugins,
  validateExports,
  removeOverrides,
  validateMissingPlugins,
  validatePluginsConfig,
  applyPluginsDefaults,
]

// Plugins are the way most functionalities is implemented.
// A plugin is a plain object that exports the following properties.

// `plugin.name` `{string}`
// Name of the plugin. Should match the module name, e.g. `test-openapi-plugin-NAME`

// `plugin.dependencies` `{string[]}`
// Other plugins required by this plugin to properly work

// `plugin.optionalDependencies` `{string[]}`
// Other plugins optionally used by this plugin

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
//      - `config` also has the following read-only properties:
//         - `plugins`: list of available plugins
//   - `task`:
//      - fired for each task
//      - arguments: `(task)`
//      - this type of handlers can modify the current task
//      - the task is the same object as the one specified in tasks files
//      - `task` also has the following read-only properties:
//         - `plugins`: list of available plugins
//         - `config`: the configuration object (after being modified by the
//           `start` handlers)
//         - `runTask(task)`: function allowing a task to fire another task
//   - `complete`:
//      - fired for each task, but after `task` type.
//      - fired whether `task` has failed or not
//      - arguments: `(task)`
//      - this type of handlers can modify the current `task`
//      - `task` also has the following read-only properties:
//         - `plugins`: list of available plugins
//         - `config`: the configuration object (after being modified by the
//           `start` handlers)
//   - `end`:
//      - fired after all tasks
//      - arguments: `({ tasks, config, plugins })`
//      - this type of handlers can return new `events`
//      - `tasks`, `config` and `plugins` are read-only
// Throwing an exception in:
//  - `start` or `end`: will stop the whole run
//  - `task`: stop the current `task`, but other tasks are still run.
//    Also the current `complete` handlers are still run.
//  - `complete`: stop the current `complete`, but other tasks are still run.

// `plugin.handlers[*].order` `{float}`
// Decides when the handler is fired compared to the other plugins handlers
// of the same `type`. Please look at the current available plugins and try
// to find out where the best place is for your plugin.

// `plugin.error` `{function}`
// Optional function taking `taskConfig` as input and returning transformed.
// Used before `task` is assigned to `error.task` to filter out task properties
// that should not appear in reporting output.

module.exports = {
  getPlugins,
}
