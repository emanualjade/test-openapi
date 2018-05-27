'use strict'

const { throwTaskError } = require('../../errors')
const { validateIsSchema } = require('../../utils')

const { isSameParam, isSameHeader } = require('./common')

// `task.parameters.*` must be present in the specification.
// Otherwise this indicates a typo, or the specification can be improved
const validateTaskParam = function({ taskParam, operation, key }) {
  const matchesSpec = operation.params.some(param => isSameParam(param, taskParam))
  if (matchesSpec) {
    return
  }

  const property = `parameters.${key}`
  const paramNames = getParamNames({ operation })
  throwTaskError(
    `'${property}' does not match any request parameter in the specification\nPossible parameters: ${paramNames}`,
    {
      property,
    },
  )
}

// Same for `task.validate.headers.*`
const validateVHeader = function({ vHeader, vHeader: { name }, headers }) {
  const matchesSpec = headers.some(param => isSameHeader(param, vHeader))
  if (matchesSpec) {
    return
  }

  const property = `response.headers.${name}`
  const headersNames = getHeadersNames({ headers })
  throwTaskError(
    `'${property}' does not match any response header in the specification.\nPossible response headers: ${headersNames}`,
    {
      property,
    },
  )
}

const getParamNames = function({ operation }) {
  return operation.params
    .map(getParamName)
    .map(name => `'${name}'`)
    .join(', ')
}

const getParamName = function({ location, name }) {
  if (location === 'body') {
    return 'body'
  }

  return `${location}.${name}`
}

const getHeadersNames = function({ headers }) {
  return headers.map(({ name }) => `'${name}'`).join(', ')
}

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateTask = function({ params, validate: { headers, body } }) {
  params.forEach(({ name, schema }) =>
    validateJsonSchema({ property: `parameters.${name}`, schema }),
  )
  headers.forEach(({ name, schema }) =>
    validateJsonSchema({ property: `response.headers.${name}`, schema }),
  )
  validateJsonSchema({ property: 'response.body', schema: body })
}

const validateJsonSchema = function({ property, schema }) {
  const { error } = validateIsSchema({ value: schema })
  if (error === undefined) {
    return
  }

  throwTaskError(`'${property}' is not a valid JSON schema v4:${error}`, { property })
}

module.exports = {
  validateTaskParam,
  validateVHeader,
  validateTask,
}
