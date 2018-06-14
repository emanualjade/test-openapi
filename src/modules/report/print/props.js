'use strict'

const { get } = require('lodash')

const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Print `error.*` properties in error printed message
const getErrorProps = function({ errorProps, ...task }) {
  return errorProps
    .map(errorProp => addErrorPropValue(errorProp, task))
    .filter(filterErrorProps)
    .map(printErrorProp)
    .join('\n\n')
}

// Get `errorProp.value` which can be a path or a function
const addErrorPropValue = function(errorProp, task) {
  const value = getErrorPropValue(errorProp, task)
  return { ...errorProp, value }
}

const getErrorPropValue = function({ value, taskValue }, task) {
  if (typeof value === 'string') {
    return get(task.error, value)
  }

  if (typeof taskValue === 'string') {
    return get(task, taskValue)
  }

  return value(task)
}

// Do not print error.* properties that are not present
// Also applies `errorProp.exclude()`
const filterErrorProps = function({ value, exclude }) {
  return value !== undefined && (exclude === undefined || !exclude(value))
}

const printErrorProp = function({ name, value, print, indented = false }) {
  // Call `errorProp.print()` if present
  const valueA = printValue({ value, print })
  // Stringify and prettify to YAML
  const string = stringifyValue(valueA)
  // Syntax highlighting
  const stringA = highlightValue({ string })
  // Indentation if `errorProp.indented: true`
  const stringB = indentValue({ string: stringA, indented })
  // Prefix with `errorProp.name`
  return `${orange(`${name}:`)} ${stringB}`
}

const printValue = function({ value, print }) {
  if (print === undefined) {
    return value
  }

  return print(value)
}

module.exports = {
  getErrorProps,
}
