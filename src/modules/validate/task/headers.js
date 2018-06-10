'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { checkRequired } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({ validate, response: { headers } }) {
  const schemas = getSchemas({ validate })

  schemas.forEach(({ name, schema }) => validateHeader({ name, schema, headers }))
}

// From `{ 'headers.NAME': value, ... }` to array of `{ name: 'NAME', schema }`
const getSchemas = function({ validate }) {
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

const validateHeader = function({ name, schema, headers }) {
  const header = getResponseHeader({ headers, name })

  checkRequired({ schema, value: header, property: PROPERTY(name), name: NAME(name) })

  if (header === undefined) {
    return
  }

  validateHeaderValue({ name, schema, header })
}

const getResponseHeader = function({ headers, name }) {
  const nameB = Object.keys(headers).find(nameA => nameA.toLowerCase() === name)

  if (nameB === undefined) {
    return
  }

  return headers[nameB]
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, schema, header }) {
  const { error } = validateFromSchema({ schema, value: header })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`${NAME(name)}${error}.`, {
    property: PROPERTY(name),
    schema,
    actual: header,
  })
}

const PROPERTY = name => `validate.headers.${name}`
const NAME = name => `Response header '${name}'`

module.exports = {
  validateHeaders,
}
