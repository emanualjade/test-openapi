'use strict'

const { get } = require('lodash')

const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Print `error.*` properties in error printed message
const getErrorProps = function({ task: { errorProps }, error }) {
  return errorProps
    .map(errorProp => addErrorPropValue(errorProp, error))
    .filter(filterErrorProps)
    .map(errorProp => printErrorProp(errorProp, error))
    .join('\n\n')
}

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

const printErrorProp = function({ name, value, print, indented = false, format }, error) {
  // Call `errorProp.print()` if present
  const valueA = printValue({ value, error, print })
  // Stringify and prettify to YAML
  const string = stringifyValue(valueA)
  // Syntax highlighting
  const stringA = highlightValue({ string, value: valueA, format })
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
