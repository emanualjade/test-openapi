import { TestOpenApiError, BugError } from './errors/error.js'
import { addErrorHandler } from './errors/handler.js'
import { checkSchema } from './validation/check.js'

// A module is either a plugin or a reporter
export const getModule = function(name, info) {
  // Can pass the module object directly
  if (typeof name !== 'string') {
    return name
  }

  const moduleObj = eLoadModule({ name, info })

  validateModule({ moduleObj, info })

  return moduleObj
}

// Load module
// TODO: `require(`${modulePrefix}${name}`)` instead
// Can only done once we moved core plugins/reporters to separate repositories
const loadModule = function({ name, info: { corePath } }) {
  // TODO: replace with `import()` once it is supported by default by ESLint
  // eslint-disable-next-line import/no-dynamic-require
  const moduleObj = require(`${corePath}${name}`)
  return { ...moduleObj, name }
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
  moduleObj,
  moduleObj: { name },
  info,
  info: { title, schema },
}) {
  const schemaA = addNameSchema({ schema })
  const props = getProps({ info, name })
  checkSchema({
    schema: schemaA,
    value: moduleObj,
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
  info: { props: getErrorProps, title },
  name,
  addModule = true,
}) {
  const props = getModuleProp({ title, name, addModule })

  if (getErrorProps === undefined) {
    return props
  }

  const propsA = getErrorProps({ name })
  return { ...props, ...propsA }
}

const getModuleProp = function({ title, name, addModule }) {
  if (!addModule) {
    return
  }

  return { module: `${title}-${name}` }
}
