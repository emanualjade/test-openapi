'use strict'

const { throwTaskError } = require('../../errors')
const { validateIsSchema } = require('../../utils')

// Normalize `task.validate.*`
const normalizeTasksValidate = function({ tasks }) {
  const tasksA = tasks.map(normalizeValidate)
  return { tasks: tasksA }
}

const normalizeValidate = function({
  validate = {},
  validate: { status = DEFAULT_STATUS_CODE, body, ...headers } = {},
  ...task
}) {
  validateJsonSchemas({ task, validate })

  const headersA = normalizeHeaders({ headers })
  const validateA = { status, headers: headersA, body }
  return { ...task, validate: validateA }
}

// Unless `task.validate.status` is overriden, will validate that response's
// status code is `200`
const DEFAULT_STATUS_CODE = { type: 'integer', enum: [200] }

// Make sure `task.validate.*.*` are valid JSON schemas
const validateJsonSchemas = function({ task, validate }) {
  Object.entries(validate).forEach(([prop, value]) => validateJsonSchema({ task, prop, value }))
}

const validateJsonSchema = function({ task: { taskKey }, prop, value }) {
  if (value === undefined) {
    return
  }

  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `validate.${prop}`
  throwTaskError(`In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`, {
    property,
    task: taskKey,
  })
}

// From `{ 'headers.NAME': schema, ... }` to array of `{ name: 'NAME', schema }`
const normalizeHeaders = function({ headers }) {
  return Object.entries(headers)
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
