'use strict'

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
//  - the `title` (as returned by `plugin.report()`)
const getHeader = function({ task, task: { path, isNested }, title, resultType }) {
  const subKeys = getSubKeys({ path, title })

  if (isNested) {
    return getNestedHeader({ task, subKeys })
  }

  const content = getContent({ task, subKeys, resultType })

  const header = `${FULL_LOWER_LINE}\n${inverse(content)}\n${FULL_UPPER_LINE}`

  const headerA = COLORS[resultType].bold(header)
  return headerA
}

// Show `task.path` and all concatenated `title` from `plugin.report()`
const getSubKeys = function({ path, title }) {
  return [path, title].map(getSubKey).join('')
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
  return red(`${HORIZONTAL_LINE}
${indent(`Nested task: ${key}`)}${subKeys}
${HORIZONTAL_LINE}`)
}

const getContent = function({ task: { key }, subKeys, resultType }) {
  const mark = MARKS[resultType]

  const content = ` ${mark}  ${key}${subKeys}`

  const contentA = padContent({ content })
  return contentA
}

// Pad header content so that `chalk.inverse()` covers the whole line
const padContent = function({ content }) {
  return content
    .split('\n')
    .map(string => string.padEnd(LINE_SIZE))
    .join('\n')
}

module.exports = {
  getHeader,
}
