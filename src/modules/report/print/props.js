'use strict'

const { get } = require('lodash')

const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Print `error.*` properties in error printed message
const printErrorProps = function({ task, errorProps }) {
  return errorProps
    .map(errorProp => addErrorPropValue(errorProp, task))
    .filter(filterErrorProps)
    .map(printErrorProp)
    .join('\n\n')
}

// Get `errorProp.value` which can be a path or a function
const addErrorPropValue = function(errorProp, task) {
  const value = getErrorPropValue(errorProp, task)
  // Call `errorProp.print()` if present
  const valueA = printValue({ value, print: errorProp.print })
  return { ...errorProp, value: valueA }
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
const filterErrorProps = function({ value }) {
  return value !== undefined
}

const printErrorProp = function({ name, value, indented = false }) {
  // Stringify and prettify to YAML
  const string = stringifyValue(value)
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
  printErrorProps,
}
