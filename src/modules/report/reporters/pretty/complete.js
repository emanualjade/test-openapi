'use strict'

const { capitalize } = require('underscore.string')

const { isObject } = require('../../../../utils')
const {
  green,
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
  spinner.update({ clear: true })

  const message = getMessage({ task, plugins })
  return message
}

// Retrieve task's message to print
const getMessage = function({ task, plugins }) {
  const taskKey = getTaskKey({ task })

  const { title, reportProps } = getReportProps({ task, plugins })

  const titleA = getTitle({ title })

  const reportPropsA = printReportProps({ reportProps })

  return `
${HORIZONTAL_LINE}
${taskKey}${titleA}
${HORIZONTAL_LINE}${reportPropsA}
`
}

// First line of the the message, with the task key and an indication on whether
// the task failed
const getTaskKey = function({ task: { key, error } }) {
  if (error !== undefined) {
    return red.bold(`${CROSS_MARK} ${key}`)
  }

  return green.bold(`${CHECK_MARK} ${key}`)
}

// Check symbol
const CHECK_MARK = '\u2714'
// Red cross symbol
const CROSS_MARK = '\u2718'

// All concatenated `title` from `plugin.report()`
const getTitle = function({ title }) {
  if (title.trim() === '') {
    return ''
  }

  return `\n\n${dim(indent(title))}`
}

// Print/prettify all `plugin.report()` return values
const printReportProps = function({ reportProps }) {
  if (Object.keys(reportProps).length === 0) {
    return ''
  }

  const reportPropsA = Object.entries(reportProps)
    .map(printTopPair)
    .join('\n\n')

  return `\n\n${indent(reportPropsA)}`
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

  if (Object.keys(value).length === 0) {
    return '{}'
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
