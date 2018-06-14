'use strict'

const { isObject } = require('../../../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ task, plugins }) {
  const errorPropsA = plugins
    .map(({ report: { errorProps } = {} }) => errorProps)
    .filter(errorProp => errorProp !== undefined)
  const errorPropsB = [getCoreErrorProps, ...errorPropsA]
  const errorPropsC = errorPropsB.map(errorProp => errorProp(task))
  const errorPropsD = [].concat(...errorPropsC)
  return errorPropsD
}

const getCoreErrorProps = function({ error: { expected, actual, property, schema } }) {
  const schemaA = getJsonSchema({ schema })

  return [
    { name: 'Expected value', value: expected },
    { name: 'Actual value', value: actual },
    { name: 'Property', value: property },
    { name: 'JSON schema', value: schemaA },
  ]
}

const getJsonSchema = function({ schema }) {
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

module.exports = {
  getErrorProps,
}
