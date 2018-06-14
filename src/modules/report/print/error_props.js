'use strict'

const { orange, indentValue, stringifyValue, highlightValue } = require('../utils')

// Print/prettify all `plugin.report()` return values
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

module.exports = {
  printErrorProps,
}
