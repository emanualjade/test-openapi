'use strict'

const { isObject } = require('../../../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ plugins }) {
  const errorPropsA = plugins.map(({ report: { errorProps = [] } = {} }) => errorProps)
  const errorPropsB = CORE_ERROR_PROPS.concat(...errorPropsA)
  return errorPropsB
}

const getExpected = function({ error: { expected } }) {
  return expected
}

const getActual = function({ error: { actual } }) {
  return actual
}

const getProperty = function({ error: { property } }) {
  return property
}

const getJsonSchema = function({ error: { schema } }) {
  // Do not print JSON schemas which are simplistic, as they do not provide extra
  // information over `Expected value`
  if (isShortcut(schema)) {
    return
  }

  return schema
}

const isShortcut = function(schema) {
  return isObject(schema) && Array.isArray(schema.enum) && schema.enum.length === 1
}

const CORE_ERROR_PROPS = [
  { name: 'Expected value', value: getExpected },
  { name: 'Actual value', value: getActual },
  { name: 'Property', value: getProperty },
  { name: 'JSON schema', value: getJsonSchema },
]

module.exports = {
  getErrorProps,
}
