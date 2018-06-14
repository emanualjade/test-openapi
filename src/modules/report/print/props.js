'use strict'

const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Print `error.*` properties in error printed message
const printErrorProps = function({ errorProps }) {
  return errorProps
    .filter(filterErrorProps)
    .map(printErrorProp)
    .join('\n\n')
}

// Do not print error.* properties that are not present
const filterErrorProps = function({ value }) {
  return value !== undefined
}

const printErrorProp = function({ name, value }) {
  // Stringify and prettify to YAML
  const string = stringifyValue(value)
  // Syntax highlighting, unless already highlighted
  const stringA = highlightValue({ string })
  // Indentation if multiline
  const stringB = indentValue({ string: stringA })
  // Prefix with `errorProp.name`
  return `${orange(`${name}:`)} ${stringB}`
}

module.exports = {
  printErrorProps,
}
