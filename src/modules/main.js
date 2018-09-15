'use strict'

const { addErrorHandler, TestOpenApiError, BugError } = require('../errors')
const { checkSchema } = require('../validation')

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

const loadModuleHandler = function(
  { code, message },
  { name, info, info: { title } },
) {
  checkModuleNotFound({ code, name, info })

  const props = getProps({ info, name })
  throw new BugError(
    `The ${title} '${name}' could not be loaded: ${message}`,
    props,
  )
}

// Error when loading a plugin that is not installed.
// This will also be triggered when loading a plugin that tries to `require()`
// a non-existing file. Unfortunately we cannot distinguish without parsing
// `error.message` which is brittle.
const checkModuleNotFound = function({
  code,
  name,
  info,
  info: { title, modulePrefix },
}) {
  if (code !== 'MODULE_NOT_FOUND') {
    return
  }

  const props = getProps({ info, name, addModule: false })
  throw new TestOpenApiError(
    `The ${title} '${name}' is used in the configuration but is not installed. Please run 'npm install ${modulePrefix}${name}.`,
    props,
  )
}

const eLoadModule = addErrorHandler(loadModule, loadModuleHandler)

// Validate export value
const validateModule = function({
  module,
  module: { name },
  info,
  info: { title, schema },
}) {
  const schemaA = addNameSchema({ schema })
  const props = getProps({ info, name })
  checkSchema({
    schema: schemaA,
    value: module,
    valueProp: title,
    message: `the ${title} '${name}' is invalid`,
    props,
    bug: true,
  })
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

// Retrieve error.* properties
const getProps = function({
  info: { props: getProps, title },
  name,
  addModule = true,
}) {
  const props = getModuleProp({ title, name, addModule })

  if (getProps === undefined) {
    return props
  }

  const propsA = getProps({ name })
  return { ...props, ...propsA }
}

const getModuleProp = function({ title, name, addModule }) {
  if (!addModule) {
    return
  }

  const module = `${title}-${name}`
  return { module }
}

module.exports = {
  getModule,
}
