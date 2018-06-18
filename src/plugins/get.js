'use strict'

const { getConfigPlugins } = require('./config')
const { loadAllPlugins } = require('./load')
const { validateExports } = require('./exports')
const { validatePluginsConfig } = require('./schema')

// Find all plugins
// Also validate their configuration and apply their defaults to the configuration
const getPlugins = function({ config }) {
  return REDUCERS.reduce(applyReducer, { config })
}

const applyReducer = function(input, reducer) {
  const output = reducer(input)
  return { ...input, ...output }
}

const REDUCERS = [getConfigPlugins, loadAllPlugins, validateExports, validatePluginsConfig]

// Plugins are the way most functionalities is implemented.
// A plugin is a plain object that exports the following properties.

// `plugin.config.general` `{object}`
// JSON schema describing the plugin general configuration at `config.PLUGIN`

// `plugin.config.task` `{object}`
// JSON schema describing the plugin task-specific configuration at `task.PLUGIN`

// `plugin.start|task|complete|end` `{function|function[]}`
// Handlers, i.e. functions fired by each plugin. This is where the logic is.
// Types:
//  - `plugin.start(config, { pluginNames }, { plugins })` `{function}`
//     - fired before all tasks
//  - `plugin.task(task, { config, pluginNames }, { plugins, runTasks, isNested })` `{function}`
//     - fired for each task
//  - `plugin.complete(task, { config, pluginNames }, { plugins })` `{function}`
//     - fired for each task, but after `task` type, whether it has failed or not
//     - only for advanced plugins
//  - `plugin.end(tasks, { config, pluginNames }, { plugins })` `{function}`
//     - fired after all tasks
// Arguments:
//   - available depends on the handler type, but can be:
//      - `config` `{object}`: the configuration object (after being modified by `plugin.start()`)
//      - `task` `{object}`: same object as the one specified in tasks files
//      - `tasks` `{array}`
//      - `pluginNames` `{array}`: list of plugins names
//      - `plugins` `{array}`: list of available plugins
//      - `runTask(task)` `{function}`: function allowing a task to fire another task
//      - `isNested` `{boolean}`: whether task was run through recursive `runTask()`
//   - `start` and `task` can modify their first argument by returning it:
//      - which will be automatically shallowly merged into the current input.
//      - arguments should not be mutated.
//   - the second and third arguments are read-only.
//   - the third argument is only for advanced plugins.
// Throwing an exception in:
//  - `start` or `end`: will stop the whole run
//  - `task`: stop the current `task`, but other tasks are still run.
//    Also `plugin.complete()` is still run.
//  - `complete`: stop the current `complete`, but other tasks are still run.

// `plugin.report(task, { config, pluginNames })` `{function}`
// Returns properties to merge to `task.PLUGIN`, but only for reporting.
// Values will be automatically formatted, and do not have to be strings.
// Can also return a `title`, shown as a sub-title during reporting.

module.exports = {
  getPlugins,
}
