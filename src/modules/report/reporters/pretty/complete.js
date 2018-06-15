'use strict'

const { capitalize } = require('underscore.string')

const { isObject } = require('../../../../utils')
const {
  darkGrey,
  darkRed,
  darkGreen,
  yellow,
  orange,
  inverse,
  indent,
  indentValue,
  stringifyValue,
  highlightValue,
  FULL_LOWER_LINE,
  FULL_UPPER_LINE,
  LINE_SIZE,
  getResultType,
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
  const resultType = getResultType(task)

  const { title, reportProps } = getReportProps({ task, plugins })

  const header = getHeader({ task, title, resultType })

  const reportPropsA = printReportProps({ task, reportProps, resultType })

  return `\n${header}${reportPropsA}\n`
}

// Header of the the message, with:
//  - a symbol indicating whether the task passed, failed or was skipped
//  - the task key
//  - the `title` (as returned by `plugin.report()`)
const getHeader = function({ task, title, resultType }) {
  const headerContent = getHeaderContent({ task, title, resultType })

  const header = `${FULL_LOWER_LINE}\n${headerContent}\n${FULL_UPPER_LINE}`

  const headerA = HEADER_COLORS[resultType].bold(header)
  return headerA
}

const getHeaderContent = function({ task: { key }, title, resultType }) {
  const mark = MARKS[resultType]

  const titleA = getTitle({ title })

  const headerContent = ` ${mark}  ${key}${titleA}`

  const headerContentA = padHeaderContent({ headerContent })

  const headerContentB = inverse(headerContentA)
  return headerContentB
}

const MARKS = {
  // Check symbol
  pass: '\u2714',
  // Cross symbol
  fail: '\u2718',
  // Pause symbol
  skip: '\u23f8',
}

// All concatenated `title` from `plugin.report()`
const getTitle = function({ title }) {
  if (title.trim() === '') {
    return ''
  }

  return `\n\n${indent(title)}`
}

// Pad header content so that `chalk.inverse()` covers the whole line
const padHeaderContent = function({ headerContent }) {
  return headerContent
    .split('\n')
    .map(string => string.padEnd(LINE_SIZE))
    .join('\n')
}

const HEADER_COLORS = {
  pass: darkGreen,
  fail: darkRed,
  skip: darkGrey,
}

// Print/prettify all `plugin.report()` return values
const printReportProps = function({ reportProps, resultType }) {
  if (resultType === 'skip' || Object.keys(reportProps).length === 0) {
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
