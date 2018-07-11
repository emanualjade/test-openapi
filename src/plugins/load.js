'use strict'

const { uniq, difference } = require('lodash')

const { addErrorHandler, TestOpenApiError } = require('../errors')

const { validatePlugin, throwPluginError } = require('./validate')
const { verifyConfig } = require('./verify')

// Retrieve `config.plugins` then `require()` all the plugins
// Also validate their configuration
const loadPlugins = function({ config: { plugins, ...config } }) {
  const pluginsA = normalizePlugins({ plugins })

  const pluginsB = pluginsA.map(name => loadPlugin({ name, config }))

  return { config, plugins: pluginsB }
}

const normalizePlugins = function({ plugins }) {
  // Specifing core plugins is a noop
  const pluginsA = difference(plugins, CORE_PLUGINS)

  const pluginsB = uniq(pluginsA)

  const pluginsC = [...CORE_PLUGINS, ...DEFAULT_PLUGINS, ...pluginsB]
  return pluginsC
}

// Plugins always included
const CORE_PLUGINS = ['glob', 'only', 'skip', 'repeat', 'helpers', 'verify', 'report']

// TODO: use a separate bundled package instead
const DEFAULT_PLUGINS = ['spec', 'call', 'validate']

const loadPlugin = function({ name, config }) {
  const plugin = eRequirePlugin(name)

  validatePlugin({ plugin })

  verifyConfig({ plugin, config })

  const pluginA = addIsCore({ plugin })
  return pluginA
}

// TODO: separate plugins in their own node modules instead
const requirePlugin = function(name) {
  // eslint-disable-next-line import/no-dynamic-require
  const plugin = require(`../modules/${name}`)
  return { ...plugin, name }
}

const requirePluginHandler = function({ code, message }, name) {
  const nameA = `'test-openapi-plugin-${name}'`

  if (code === 'MODULE_NOT_FOUND') {
    throw new TestOpenApiError(
      `The plugin ${nameA} is used in the configuration but is not installed`,
    )
  }

  const messageA = `The plugin ${nameA} could not be loaded: ${message}`
  throwPluginError({ message: messageA, name })
}

const eRequirePlugin = addErrorHandler(requirePlugin, requirePluginHandler)

// Used e.g. during reporting
const addIsCore = function({ plugin, plugin: { name } }) {
  const isCore = CORE_PLUGINS.includes(name)
  return { ...plugin, isCore }
}

// `load`, i.e. before all tasks:
//   - `glob`: merge tasks whose name include globbing matching other task names.
//   - `only`: select tasks according to `config|task.only`
//   - `skip`: skip tasks according to `config|task.skip`
// `start`, i.e. before all tasks:
//   - `spec`: parse, validate and normalize an OpenAPI specification
//   - `report`: start reporting
// `task`, i.e. for each task:
//   - `repeat`: repeat each task `config.repeat` times
//   - `helpers`: substitute helpers values
//   - `spec`: add OpenAPI specification to `task.call|validate.*`
//   - `call`: fire HTTP call
//   - `validate`: validate response against `task.validate.*` JSON schemas
// `complete`, i.e. after each tasks:
//   - `report`: reporting for current task
// `end`, i.e. after all tasks:
//   - `report`: end of reporting

// Plugins are the way most functionalities is implemented.
// A plugin is a plain object that exports the following properties.

// `plugin.config.general` `{object}`
// JSON schema describing the plugin general configuration at `config.PLUGIN`

// `plugin.config.task` `{object}`
// JSON schema describing the plugin task-specific configuration at `task.PLUGIN`

// `plugin.load|start|run|complete|end` `{function|function[]}`
// Handlers, i.e. functions fired by each plugin. This is where the logic is.
// Types:
//  - `plugin.load(tasks, { config, pluginNames }, { plugins })` `{function}`
//     - fired before all tasks
//  - `plugin.start(startData, { config, pluginNames }, { plugins })` `{function}`
//     - fired before all tasks
//  - `plugin.run(task, { config, startData, pluginNames, helpers }, { plugins, runTask, nestedPath })` `{function}`
//     - fired for each task
//  - `plugin.complete(task, { config, startData, pluginNames }, { plugins })` `{function}`
//     - fired for each task, but after `run` type, whether it has failed or not
//     - only for advanced plugins
//  - `plugin.end(tasks, { config, startData, pluginNames }, { plugins })` `{function}`
//     - fired after all tasks
// Arguments:
//   - available depends on the handler type, but can be:
//      - `config` `{object}`: the configuration object (after being modified by `plugin.start()`)
//      - `startData` `{object}`: the object returned by each `start` handler
//      - `task` `{object}`: same object as the one specified in tasks files
//      - `tasks` `{array}`
//      - `pluginNames` `{array}`: list of plugins names
//      - `plugins` `{array}`: list of available plugins
//      - `runTask({ task, property, self })` `{function}`:
//         function allowing a task to fire another task
//      - `nestedPath` `{array}`: set when task was run through recursive `runTask()`
//      - `helpers(value)` `{function}`: substitute helpers
//   - `load`, `start` and `run` can modify their first argument by returning it:
//      - which will be automatically shallowly merged into the current input.
//      - arguments should not be mutated.
//   - the second and third arguments are read-only.
//   - the third argument is only for advanced plugins.
// Throwing an exception in:
//  - `load`, `start` or `end`: will stop the whole run
//  - `run`: stop the current task, but other tasks are still run.
//    Also `plugin.complete()` is still run.
//  - `complete`: stop the current `complete`, but other tasks are still run.

// `plugin.report(task, { config, pluginNames })` `{function}`
// Returns properties to merge to `task.PLUGIN`, but only for reporting.
// Values will be automatically formatted, and do not have to be strings.
// Can also return a `title`, shown as a sub-title during reporting.

module.exports = {
  loadPlugins,
}
