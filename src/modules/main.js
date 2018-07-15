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

const loadModuleHandler = function({ code, message }, { name, info }) {
  checkModuleNotFound({ code, name, info })

  throwBugError(`could not be loaded: ${message}`, { name, info })
}

const checkModuleNotFound = function({ code, name, info: { title, modulePrefix, props } }) {
  if (code !== 'MODULE_NOT_FOUND') {
    return
  }

  const propsA = getProps({ props, name })

  throw new TestOpenApiError(
    `The ${title} '${name}' is used in the configuration but is not installed. Please run 'npm install ${modulePrefix}${name}.`,
    propsA,
  )
}

const eLoadModule = addErrorHandler(loadModule, loadModuleHandler)

// Validate export value
const validateModule = function({ module, module: { name }, info, info: { schema } }) {
  const { error } = validateFromSchema({ schema, value: module })
  if (error === undefined) {
    return
  }

  throwBugError(`is invalid: ${error}`, { name, info })
}

const getProps = function({ props, name }) {
  if (props === undefined) {
    return
  }

  return props({ name })
}

// Throw a `bug` error
const throwBugError = function(message, { name, info: { title, pluginPrefix } }) {
  const errorA = new Error(`The ${title} '${name}' ${message}`)
  errorA.plugin = `${pluginPrefix}${name}`
  throw errorA
}

const INFO = {
  plugin: {
    title: 'plugin',
    modulePrefix: 'test-openapi-plugin-',
    pluginPrefix: '',
    corePath: '../core/',
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
