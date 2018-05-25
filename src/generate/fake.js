'use strict'

const { generateFromSchema } = require('../utils')

// Generates random values based on JSON schema
const fakeValues = function({ request }) {
  const schema = getRequestJsonSchema({ request })
  const values = generateFromSchema({ schema })
  const requestA = addGeneratedValues({ values, request })
  const requestB = removeNull({ request: requestA })
  return requestB
}

// Transform OpenAPI parameters into a single JSON schema
const getRequestJsonSchema = function({ request }) {
  const required = getRequired({ request })

  const properties = getProperties({ request })

  const schema = { type: 'object', properties, required }
  return schema
}

// OpenAPI `required` to JSON schema `required`
const getRequired = function({ request }) {
  return request
    .filter(({ required }) => required)
    .map(({ location, name }) => `${location}.${name}`)
}

// Transform OpenAPI parameter into a JSON schema of `type: object`
const getProperties = function({ request }) {
  const requestA = request.map(getSchema)
  const properties = Object.assign({}, ...requestA)
  return properties
}

const getSchema = function({ location, name, schema }) {
  const nameA = `${location}.${name}`

  const schemaA = fixArray({ schema })

  return { [nameA]: schemaA }
}

// json-schema-faker does not work properly with array schema that do not have
// an `items.type` property
const fixArray = function({ schema, schema: { type, items = {} } }) {
  if (type !== 'array' || items.type !== undefined) {
    return schema
  }

  return { ...schema, items: { ...items, type: 'string' } }
}

// Merge generated values back to original request parameters as `param.value`
const addGeneratedValues = function({ values, request }) {
  return (
    request
      .map(param => addGeneratedValue({ values, param }))
      // Optional request parameters that have not been picked
      .filter(({ value }) => value !== undefined)
  )
}

const addGeneratedValue = function({ values, param, param: { location, name } }) {
  const value = values[`${location}.${name}`]
  return { ...param, value }
}

// Specifying `type: 'null'` or `enum: ['null']` means 'do not send this parameter'
// Specifying `type: ['null', ...]` means 'maybe send this parameter (or not, randomly)'
// No matter what, only required parameters or parameters specified in test.request.* can be sent
const removeNull = function({ request }) {
  return request.filter(isNotNullParam)
}

const isNotNullParam = function({ value }) {
  return value !== null
}

module.exports = {
  fakeValues,
}
