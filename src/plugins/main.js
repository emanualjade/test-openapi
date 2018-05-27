'use strict'

const { get, set, merge, uniq, difference } = require('lodash')

const { sortBy, reduceAsync, isObject, validateFromSchema } = require('../utils')
const { addErrorHandler, TestOpenApiError } = require('../errors')

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

// Find all plugins
// Also validate their configuration and apply their defaults to the configuration
const getPlugins = function({ config: { plugins, ...config } }) {
  const pluginNames = [...DEFAULT_PLUGINS, ...plugins]
  const pluginsA = loadPlugins({ pluginNames })
  const pluginsB = removeOverrides({ plugins: pluginsA })

  validateUsedPlugins({ config, plugins: pluginsB })

  const configA = applyPluginsConfig({ config, plugins: pluginsB })

  return { config: configA, plugins: pluginsB }
}

// Plugins always included
const DEFAULT_PLUGINS = ['call', 'generate', 'validate', 'spec', 'repeat', 'glob', 'deps', 'dry']

// `require()` all the plugins
const loadPlugins = function({ pluginNames = [], loaded = [] }) {
  if (pluginNames.length === 0) {
    return []
  }

  const parentPlugins = loadParentPlugins({ pluginNames, loaded })
  const childPlugins = loadChildPlugins({ parentPlugins, loaded })
  return [...parentPlugins, ...childPlugins]
}

const loadParentPlugins = function({ pluginNames, loaded }) {
  return uniq(pluginNames)
    .map(pluginName => loadPlugin({ pluginName, loaded }))
    .filter(plugin => plugin !== undefined)
}

// `require()` all the plugins dependencies (from `plugin.dependencies`)
const loadChildPlugins = function({ parentPlugins, loaded }) {
  const dependenciesA = parentPlugins.map(({ dependencies }) => dependencies)
  const dependenciesB = [].concat(...dependenciesA)

  // Make sure dependencies do not require already loaded plugins
  const loadedA = [...loaded, ...parentPlugins]

  // Recursion
  const childPlugins = loadPlugins({ pluginNames: dependenciesB, loaded: loadedA })
  return childPlugins
}

const loadPlugin = function({ pluginName, loaded }) {
  const alreadyLoaded = loaded.some(({ name }) => name === pluginName)
  if (alreadyLoaded) {
    return
  }

  const plugin = eRequirePlugin({ pluginName })
  return plugin
}

// TODO: separate plugins in their own node modules instead
const requirePlugin = function({ pluginName }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(`../modules/${pluginName}`)
}

const requirePluginHandler = function(_, { pluginName }) {
  throw new TestOpenApiError(
    `The plugin '${pluginName}' is used in the configuration but is not installed. Please run 'npm install test-openapi-plugin-${pluginName}'.`,
  )
}

const eRequirePlugin = addErrorHandler(requirePlugin, requirePluginHandler)

// Remove all plugins specified in `plugin.overrides`
const removeOverrides = function({ plugins }) {
  const overrides = getOverrides({ plugins })
  const pluginsA = plugins.filter(({ name }) => !overrides.includes(name))
  return pluginsA
}

const getOverrides = function({ plugins }) {
  const overridesA = plugins.map(({ overrides = [] }) => overrides)
  const overridesB = [].concat(...overridesA)
  const overridesC = uniq(overridesB)
  return overridesC
}

// Make sure the user did not forget to include some plugins
const validateUsedPlugins = function({ config, plugins }) {
  const missingPlugins = getMissingPlugins({ config, plugins })
  if (missingPlugins.length === 0) {
    return
  }

  const missingPluginsA = missingPlugins.join(', ')
  throw new TestOpenApiError(
    `The configuration uses the following plugins but they are not specified in 'configuration.plugins': ${missingPluginsA}`,
    { property: 'plugins' },
  )
}

const getMissingPlugins = function({ config, plugins }) {
  const usedPlugins = findUsedPlugins({ config })
  const pluginNames = plugins.map(({ name }) => name)

  const missingPlugins = difference(usedPlugins, pluginNames)
  return missingPlugins
}

// Guess which plugins are used by the current configuration
const findUsedPlugins = function({ config }) {
  const usedPlugins = findUsedPluginNames({ config })
  const usedPluginsA = cleanUsedPlugins({ usedPlugins })
  return usedPluginsA
}

const findUsedPluginNames = function({ config, config: { tasks } }) {
  const generalPluginNames = Object.keys(config)
  const taskPluginNamesA = tasks.map(Object.keys)
  const usedPlugins = [].concat(...taskPluginNamesA, ...generalPluginNames)
  return usedPlugins
}

const cleanUsedPlugins = function({ usedPlugins }) {
  const usedPluginsA = uniq(usedPlugins)
  const usedPluginsB = usedPluginsA.filter(name => !CORE_PROPS.includes(name))
  return usedPluginsB
}

// Those properties are not plugin-related
const CORE_PROPS = ['tasks', 'originalTask', 'taskKey']

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
  getPlugins,
  runHandlers,
}
