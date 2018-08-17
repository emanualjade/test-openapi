'use strict'

const cliTruncate = require('cli-truncate')

const {
  red,
  inverse,
  indent,
  FULL_LOWER_LINE,
  FULL_UPPER_LINE,
  LINE_SIZE,
  HORIZONTAL_LINE,
} = require('../../../utils')
const { MARKS, COLORS } = require('../constants')

// Header of the the message, with:
//  - a symbol indicating whether the task passed, failed or was skipped
//  - the task key
//  - the `titles` (as returned by `plugin.report()`)
const getHeader = function({ task, task: { isNested }, titles, resultType }) {
  const subKeys = getSubKeys({ task, titles })

  if (isNested) {
    return getNestedHeader({ task, subKeys })
  }

  return getFullHeader({ task, subKeys, resultType })
}

// Show `task.path` and all `titles` from `plugin.report()`
const getSubKeys = function({ task: { path }, titles }) {
  return [path, titles.join('\n')].map(getSubKey).join('')
}

const getSubKey = function(string) {
  const stringA = string.trim()

  if (stringA === '') {
    return ''
  }

  return `\n\n${indent(stringA)}`
}

// Header for nested tasks
const getNestedHeader = function({ task: { key }, subKeys }) {
  const content = `${indent(`Nested task: ${key}`)}${subKeys}`

  const contentA = fitContent({ content })

  const header = red(`${HORIZONTAL_LINE}\n${contentA}\n${HORIZONTAL_LINE}`)
  return header
}

const getFullHeader = function({ task: { key }, subKeys, resultType }) {
  const content = ` ${MARKS[resultType]}  ${key}${subKeys}`

  const contentA = fitContent({ content })

  const header = `${FULL_LOWER_LINE}\n${inverse(contentA)}\n${FULL_UPPER_LINE}`
  const headerA = COLORS[resultType].bold(header)
  return headerA
}

// If the line is too long, truncate it
// If the line is too short, pad it so that `chalk.inverse()` covers the whole line
const fitContent = function({ content }) {
  return content
    .split('\n')
    .map(fitLine)
    .join('\n')
}

const fitLine = function(string) {
  const stringA = cliTruncate(string, LINE_SIZE - 1)
  const stringB = stringA.padEnd(LINE_SIZE)
  return stringB
}

module.exports = {
  getHeader,
}
