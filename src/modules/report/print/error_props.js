'use strict'

const { omitBy } = require('lodash')

const { isObject } = require('../../../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ task, plugins }) {
  const errorPropsA = plugins
    .map(({ report: { errorProps } = {} }) => errorProps)
    .filter(errorProp => errorProp !== undefined)
  // Core has merging priority
  const errorPropsB = [...errorPropsA, getCoreErrorProps]
  const errorPropsC = errorPropsB.map(errorProp => {
    const values = errorProp(task)
    // Do not print error.* properties that are not present
    const valuesA = omitBy(values, value => value === undefined)
    return valuesA
  })
  const errorPropsD = Object.assign({}, ...errorPropsC)
  return errorPropsD
}

const getCoreErrorProps = function({ error: { expected, actual, property, schema } }) {
  const schemaA = getJsonSchema({ schema })

  return {
    'Expected value': expected,
    'Actual value': actual,
    Property: property,
    'JSON schema': schemaA,
  }
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
