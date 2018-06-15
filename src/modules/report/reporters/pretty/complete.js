'use strict'

const { capitalize } = require('underscore.string')

const { isObject } = require('../../../../utils')
const {
  red,
  dim,
  yellow,
  orange,
  indent,
  indentValue,
  stringifyValue,
  highlightValue,
  HORIZONTAL_LINE,
} = require('../../utils')
const { getReportProps } = require('../../props')

// Print task errors and update spinner
const complete = function({ options: { spinner }, ...task }, { plugins }) {
  const failed = task.error !== undefined

  spinner.update({ clear: failed })

  if (!failed) {
    return
  }

  const errorMessage = getErrorMessage({ task, plugins })
  return errorMessage
}

// Retrieve task's error to print
const getErrorMessage = function({
  task,
  task: {
    key,
    error: { message },
  },
  plugins,
}) {
  const { title, reportProps } = getReportProps({ task, plugins })

  const reportPropsA = printReportProps({ reportProps })

  return `
${HORIZONTAL_LINE}
${CROSS_MARK} ${red.bold(key)}

${dim(indent(title))}

${indent(message)}
${HORIZONTAL_LINE}

${indent(reportPropsA)}
`
}

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

// Print/prettify all `plugin.report()` return values
const printReportProps = function({ reportProps }) {
  return Object.entries(reportProps)
    .map(printTopPair)
    .join('\n\n')
}

// Print top-level level pairs
const printTopPair = function([name, value]) {
  const valueA = printReportProp(value)
  return `${orange(`${capitalize(name, true)}:`)} ${indentValue(valueA)}`
}

// Print `error.*` properties in error printed message
// Do it each second depth level, i.e. under error.PLUGIN_NAME.*
const printReportProp = function(value) {
  // There is no second depth level, e.g. core `reportProps`
  if (!isObject(value)) {
    return prettifyValue(value)
  }

  const valueA = Object.entries(value)
    .map(printDeepPair)
    .join('\n')
  // Make sure it is on next value
  return `\n${valueA}`
}

// Print second-depth level pairs
const printDeepPair = function([name, value]) {
  const valueA = prettifyValue(value)
  return `${yellow(name)}: ${indentValue(valueA)}`
}

const prettifyValue = function(value) {
  // Stringify and prettify to YAML
  const string = stringifyValue(value)
  // Syntax highlighting, unless already highlighted
  const stringA = highlightValue(string)
  return stringA
}

module.exports = {
  complete,
}
