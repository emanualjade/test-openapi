'use strict'

const { getConfigPlugins } = require('./config')
const { loadAllPlugins } = require('./load')
const { validateExports } = require('./exports')
const { validatePluginsConfig } = require('./plugin_conf')
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
  validatePluginsConfig,
  applyPluginsDefaults,
]

// Plugins are the way most functionalities is implemented.
// A plugin is a plain object that exports the following properties.

// `plugin.start|task|complete|end` `{function}`
// Handlers are the functions fired by each plugin. This is where the logic is.
// The goal of each handler is to usually to modify its input (first argument).
// However it should do so not by mutating its arguments, but by returning
// properties, which will be automatically shallowly merged into the current input.
// Throwing an exception in:
//  - `start` or `end`: will stop the whole run
//  - `task`: stop the current `task`, but other tasks are still run.
//    Also `plugin.complete()` is still run.
//  - `complete`: stop the current `complete`, but other tasks are still run.

// `plugin.start` `{function}`
//  - fired before all tasks
//  - arguments: `(config)`
//  - this type of handlers can modify the configuration object
//  - `config` also has the following read-only properties:
//     - `plugins`: list of available plugins

// `plugin.task` `{function}`
//  - fired for each task
//  - arguments: `(task)`
//  - this type of handlers can modify the current task
//  - the task is the same object as the one specified in tasks files
//  - `task` also has the following read-only properties:
//     - `plugins`: list of available plugins
//     - `config`: the configuration object (after being modified by `plugin.start()`)
//     - `runTask(task)`: function allowing a task to fire another task

// `plugin.complete` `{function}`
//  - fired for each task, but after `task` type.
//  - fired whether `task` has failed or not
//  - arguments: `({ task, error })`
//     - `error` is only defined if `task` failed
//     - when using `repeat` plugin, `tasks` and `errors` will also be set
//  - this type of handlers can modify the current `task` or `error`
//  - it also has the following read-only properties:
//     - `plugins`: list of available plugins
//     - `config`: the configuration object (after being modified by `plugin.start()`)

// `plugin.end` `{function}`
//  - fired after all tasks
//  - arguments: none
//  - this type of handlers can return new `events`
//  - it also has the following read-only properties:
//     - `plugins`: list of available plugins
//     - `config`: the configuration object (after being modified by `plugin.start()`)
//     - `tasks`

// `plugin.report.title` `{function}`
// Function that take current task as input and return a string shown as a
// sub-title during error reporting

// `plugin.report.errorProps` `{object[]}`
// Properties to print during error reporting

module.exports = {
  getPlugins,
}
