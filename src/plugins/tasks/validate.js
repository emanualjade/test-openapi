'use strict'

const { DEFAULT_STATUS_CODE } = require('../../constants')

// Normalize `task.validate.*`
const normalizeTasksValidate = function({ tasks }) {
  return tasks.map(normalizeValidate)
}

const normalizeValidate = function({
  validate: { status = DEFAULT_STATUS_CODE, body, ...validate } = {},
  ...task
}) {
  const headers = normalizeHeaders({ validate })
  const validateA = { status, headers, body }
  return { ...task, validate: validateA }
}

// From `{ 'headers.NAME': schema, ... }` to array of `{ name: 'NAME', schema }`
const normalizeHeaders = function({ validate }) {
  return Object.entries(validate)
    .filter(isHeader)
    .map(getHeader)
}

const isHeader = function([name]) {
  return HEADERS_PREFIX_REGEXP.test(name)
}

const getHeader = function([name, schema]) {
  const nameA = name.replace(HEADERS_PREFIX_REGEXP, '')
  return { name: nameA, schema }
}

// We use the `task.validate['headers.NAME']` notation instead of
// `task.validate.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const HEADERS_PREFIX_REGEXP = /^headers\./

module.exports = {
  normalizeTasksValidate,
}
