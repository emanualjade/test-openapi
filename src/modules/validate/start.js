'use strict'

const { mapValues } = require('lodash')

const { TestOpenApiError } = require('../../errors')
const { validateIsSchema, getShortcut, isObject } = require('../../utils')

// Normalize `task.validate.*`
const normalizeValidate = function({ tasks }) {
  const tasksA = tasks.map(normalizeTaskValidate)
  return { tasks: tasksA }
}

const normalizeTaskValidate = function({ validate, ...task }) {
  const validateA = mapValues(validate, applyShortcut)

  validateJsonSchemas({ task, validate: validateA })

  const { status: statusA, body, ...headers } = validateA
  const headersA = normalizeHeaders({ headers })
  const schemas = { status: statusA, headers: headersA, body }

  return { ...task, validate: { ...validate, schemas } }
}

// `task.validate.*: non-object` is shortcut for `{ enum: [value] }`
const applyShortcut = function(value) {
  // object means it's not a shortcut notation.
  if (isObject(value)) {
    return value
  }

  return getShortcut(value)
}

// Make sure `task.validate.*.*` are valid JSON schemas
const validateJsonSchemas = function({ task, validate }) {
  Object.entries(validate).forEach(([prop, value]) => validateJsonSchema({ task, prop, value }))
}

const validateJsonSchema = function({ task: { key }, prop, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `validate.${prop}`
  throw new TestOpenApiError(
    `In task '${key}', '${property}' is not a valid JSON schema v4:${error}`,
    { property, key },
  )
}

// From `{ 'headers.NAME': value, ... }` to array of `{ name: 'NAME', value }`
const normalizeHeaders = function({ headers }) {
  return Object.entries(headers)
    .filter(isHeader)
    .map(getHeader)
}

const isHeader = function([name]) {
  return HEADERS_PREFIX_REGEXP.test(name)
}

const getHeader = function([name, value]) {
  const nameA = name.replace(HEADERS_PREFIX_REGEXP, '')
  return { name: nameA, value }
}

// We use the `task.validate['headers.NAME']` notation instead of
// `task.validate.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const HEADERS_PREFIX_REGEXP = /^headers\./

module.exports = {
  normalizeValidate,
}
