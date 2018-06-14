'use strict'

const { omitBy } = require('lodash')

const { isObject } = require('../../../utils')
const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ task, plugins }) {
  const reportFuncs = plugins
    .map(({ report: { errorProps } = {} }) => errorProps)
    .filter(reportFunc => reportFunc !== undefined)
  // Core has merging priority
  const reportFuncsA = [...reportFuncs, getCoreErrorProps]

  const errorProps = reportFuncsA.map(reportFunc => getPluginErrorProps({ reportFunc, task }))
  const errorPropsA = Object.assign({}, ...errorProps)

  const errorPropsB = printErrorProps({ errorProps: errorPropsA })
  return errorPropsB
}

const getPluginErrorProps = function({ reportFunc, task }) {
  const errorProps = reportFunc(task)

  const errorPropsA = omitBy(errorProps, isEmptyProp)
  return errorPropsA
}

// Do not print error.* properties that are not present
const isEmptyProp = function(value) {
  return value === undefined
}

const printErrorProps = function({ errorProps }) {
  return Object.entries(errorProps)
    .map(printErrorProp)
    .join('\n\n')
}

// Print `error.*` properties in error printed message
const printErrorProp = function([name, value]) {
  // Stringify and prettify to YAML
  const string = stringifyValue(value)
  // Syntax highlighting, unless already highlighted
  const stringA = highlightValue({ string })
  // Indentation if multiline
  const stringB = indentValue({ string: stringA })
  // Prefix with `errorProp.name`
  return `${orange(`${name}:`)} ${stringB}`
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
