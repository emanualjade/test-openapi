'use strict'

const { addErrorHandler, TestOpenApiError } = require('../errors')
const { validateFromSchema } = require('../validation')

const PLUGIN_SCHEMA = require('./plugin_schema')
const REPORTER_SCHEMA = require('./reporter_schema')

// A module is either a plugin or a reporter
const getModule = function({ name, type }) {
  // Can pass the module object directly
  if (typeof name !== 'string') {
    return name
  }

  const info = INFO[type]

  const module = eLoadModule({ name, info })

  validateModule({ module, info })

  return module
}

// Load module
// TODO: `require(`${modulePrefix}${name}`)` instead
// Can only done once we moved core plugins/reporters to separate repositories
const loadModule = function({ name, info: { corePath } }) {
  // eslint-disable-next-line import/no-dynamic-require
  const module = require(`${corePath}${name}`)
  return { ...module, name }
}

const loadModuleHandler = function(
  { code, message },
  { name, info: { title, modulePrefix, props } },
) {
  const moduleName = `${modulePrefix}${name}'`

  if (code === 'MODULE_NOT_FOUND') {
    throw new TestOpenApiError(
      `The ${title} '${name}' is used in the configuration but is not installed. Please run 'npm install ${moduleName}'.`,
      props({ name }),
    )
  }

  // Throw a `bug` error
  const error = new Error(`The ${title} '${name}' could not be loaded: ${message}`)
  error.plugin = name
  throw error
}

const eLoadModule = addErrorHandler(loadModule, loadModuleHandler)

// Validate export value
const validateModule = function({
  module,
  module: { name },
  info: { schema, title, pluginPrefix },
}) {
  const { error } = validateFromSchema({ schema, value: module })
  if (error === undefined) {
    return
  }

  const errorA = new Error(`The ${title} '${name}' is invalid: ${error}`)
  errorA.plugin = `${pluginPrefix}${name}`
  throw errorA
}

const INFO = {
  plugin: {
    title: 'plugin',
    modulePrefix: 'test-openapi-plugin-',
    pluginPrefix: '',
    corePath: '../core/',
    props: () => ({}),
    schema: PLUGIN_SCHEMA,
  },
  reporter: {
    title: 'reporter',
    modulePrefix: 'test-openapi-reporter-',
    pluginPrefix: 'reporter-',
    corePath: '../core/report/reporters/',
    props: ({ name }) => ({ property: `report.${name}` }),
    schema: REPORTER_SCHEMA,
  },
}

module.exports = {
  getModule,
}
