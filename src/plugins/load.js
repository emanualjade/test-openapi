'use strict'

const { uniq, difference } = require('lodash')

const { addErrorHandler, TestOpenApiError } = require('../errors')

// Retrieve `config.plugins` then `require()` all the plugins
const loadPlugins = function({ config: { plugins, ...config } }) {
  const pluginsA = normalizePlugins({ plugins })

  const pluginsB = pluginsA.map(eRequirePlugin)

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
const CORE_PLUGINS = ['glob', 'only', 'skip', 'repeat', 'deps', 'report']

// TODO: use a separate bundled package instead
const DEFAULT_PLUGINS = ['spec', 'random', 'call', 'validate']

// TODO: separate plugins in their own node modules instead
const requirePlugin = function(name) {
  // eslint-disable-next-line import/no-dynamic-require
  const plugin = require(`../modules/${name}`)
  const isCore = CORE_PLUGINS.includes(name)
  return { ...plugin, name, isCore }
}

const requirePluginHandler = function(_, name) {
  throw new TestOpenApiError(
    `The plugin '${name}' is used in the configuration but is not installed. Please run 'npm install test-openapi-plugin-${name}'.`,
  )
}

const eRequirePlugin = addErrorHandler(requirePlugin, requirePluginHandler)

// `start`, i.e. before all tasks:
//   - `glob`: merge tasks whose name include globbing matching other task names.
//   - `only`: check if `config|task.only` is used
//   - `spec`: parse, validate and normalize an OpenAPI specification
//   - `report`: start reporting
// `task`, i.e. for each task:
//   - `only`: select tasks according to `config|task.only`
//   - `skip`: skip task if `task.skip: true`
//   - `repeat`: repeat each task `config.repeat` times
//   - `deps`: replace all `deps`, i.e. references to other tasks
//   - `spec`: add OpenAPI specification to `task.random|validate.*`
//   - `random`: generates random values based on `task.random.*` JSON schemas
//   - `call`: fire HTTP call
//   - `validate`: validate response against `task.validate.*` JSON schemas
// `complete`, i.e. after each tasks:
//   - `report`: reporting for current task
// `end`, i.e. after all tasks:
//   - `report`: end of reporting

module.exports = {
  loadPlugins,
}
