'use strict'

const { get } = require('lodash')

const { isShortcut } = require('../../../../../utils')

const { orange } = require('./colors')
const { indentValue } = require('./indent')
const { stringifyValue } = require('./stringify')
const { highlightValue } = require('./highlight')
const { callErrorProps } = require('./call')

// Print `error.*` properties in error printed message
const getErrorProps = function({ error }) {
  return ERROR_PROPS.map(errorProp => addErrorPropValue(errorProp, error))
    .filter(filterErrorProps)
    .map(errorProp => printErrorProp(errorProp, error))
    .join('\n\n')
}

// List of possible error properties
const ERROR_PROPS = [
  { name: 'Property', value: 'property' },
  { name: 'Expected', value: 'expected' },
  { name: 'Value', value: 'actual' },
  { name: 'JSON schema', value: 'schema', exclude: isShortcut, highlighted: true },
  ...callErrorProps,
]

// Get `errorProp.value` which can be a path or a function
const addErrorPropValue = function(errorProp, error) {
  const value = getErrorPropValue(errorProp, error)
  return { ...errorProp, value }
}

const getErrorPropValue = function({ value }, error) {
  if (typeof value === 'string') {
    return get(error, value)
  }

  return value(error)
}

// Do not print error.* properties that are not present
// Also applies `errorProp.exclude()`
const filterErrorProps = function({ value, exclude }) {
  return value !== undefined && (exclude === undefined || !exclude(value))
}

const printErrorProp = function(
  { name, value, print, highlighted = false, indented = false },
  error,
) {
  // Call `errorProp.print()` if present
  const valueA = printValue({ value, error, print })
  // Stringify and prettify to YAML
  const string = stringifyValue(valueA)
  // Syntax highlighting if `errorProp.highlighted: true`
  const stringA = highlightValue({ string, highlighted })
  // Indentation if `errorProp.indented: true`
  const stringB = indentValue({ string: stringA, indented })
  // Prefix with `errorProp.name`
  return `${orange(`${name}:`)} ${stringB}`
}

const printValue = function({ value, error, print }) {
  if (print === undefined) {
    return value
  }

  return print(value, error)
}

module.exports = {
  getErrorProps,
}
