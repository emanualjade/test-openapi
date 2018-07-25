'use strict'

const { addErrorHandler, TestOpenApiError } = require('../errors')
const { validateFromSchema } = require('../validation')

// A module is either a plugin or a reporter
const getModule = function(name, info) {
  // Can pass the module object directly
  if (typeof name !== 'string') {
    return name
  }

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

// Error when loading a plugin that is not installed.
// This will also be triggered when loading a plugin that tries to `require()`
// a non-existing file. Unfortunately we cannot distinguish without parsing
// `error.message` which is brittle.
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
  const schemaA = addNameSchema({ schema })

  const { error } = validateFromSchema({ schema: schemaA, value: module })
  if (error === undefined) {
    return
  }

  throwBugError(`is invalid: ${error}`, { name, info })
}

// We restrict module names to make sure they can appear in dot notations
// in `error.property` without escaping.
// And also to make sure they are simple to read and write.
const addNameSchema = function({ schema, schema: { properties } }) {
  return { ...schema, properties: { ...properties, name: NAME_SCHEMA } }
}

const NAME_SCHEMA = {
  type: 'string',
  pattern: '^[a-zA-Z_$][\\w_$-]*$',
}

const getProps = function({ props, name }) {
  if (props === undefined) {
    return
  }

  return props({ name })
}

// Throw a `bug` error
const throwBugError = function(message, { name, info: { title } }) {
  const errorA = new Error(`The ${title} '${name}' ${message}`)
  errorA.module = `${title}-${name}`
  throw errorA
}

module.exports = {
  getModule,
}
