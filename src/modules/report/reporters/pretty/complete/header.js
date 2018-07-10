'use strict'

const {
  gray,
  red,
  green,
  inverse,
  indent,
  FULL_LOWER_LINE,
  FULL_UPPER_LINE,
  LINE_SIZE,
  HORIZONTAL_LINE,
} = require('../../../utils')

// Header of the the message, with:
//  - a symbol indicating whether the task passed, failed or was skipped
//  - the task key
//  - the `title` (as returned by `plugin.report()`)
const getHeader = function({ task, task: { isNested }, title, resultType }) {
  const titleA = getTitle({ title })

  if (isNested) {
    return getNestedHeader({ task, title: titleA })
  }

  const content = getContent({ task, title: titleA, resultType })

  const header = `${FULL_LOWER_LINE}\n${inverse(content)}\n${FULL_UPPER_LINE}`

  const headerA = HEADER_COLORS[resultType].bold(header)
  return headerA
}

// All concatenated `title` from `plugin.report()`
const getTitle = function({ title }) {
  if (title.trim() === '') {
    return ''
  }

  return `\n\n${indent(title)}`
}

// Header for nested tasks
const getNestedHeader = function({ task: { key }, title }) {
  return red(`${HORIZONTAL_LINE}
${indent(`Nested task: ${key}`)}${title}
${HORIZONTAL_LINE}`)
}

const getContent = function({ task: { key }, title, resultType }) {
  const mark = MARKS[resultType]

  const content = ` ${mark}  ${key}${title}`

  const contentA = padContent({ content })
  return contentA
}

const MARKS = {
  // Check symbol
  pass: '\u2714',
  // Cross symbol
  fail: '\u2718',
  // Pause symbol
  skip: '\u23f8',
}

// Pad header content so that `chalk.inverse()` covers the whole line
const padContent = function({ content }) {
  return content
    .split('\n')
    .map(string => string.padEnd(LINE_SIZE))
    .join('\n')
}

const HEADER_COLORS = {
  pass: green,
  fail: red,
  skip: gray,
}

module.exports = {
  getHeader,
}
