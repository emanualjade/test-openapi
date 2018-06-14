'use strict'

const { isObject } = require('../../../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ plugins }) {
  const errorPropsA = plugins.map(({ report: { errorProps = [] } = {} }) => errorProps)
  const errorPropsB = CORE_ERROR_PROPS.concat(...errorPropsA)
  return errorPropsB
}

const printJsonSchema = function(schema) {
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
  { name: 'Expected value', value: 'expected' },
  { name: 'Actual value', value: 'actual' },
  { name: 'Property', value: 'property' },
  { name: 'JSON schema', value: 'schema', print: printJsonSchema },
]

module.exports = {
  getErrorProps,
}
