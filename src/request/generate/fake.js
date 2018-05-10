'use strict'

const { generateFromSchema } = require('../../utils')

// Generates random values based on JSON schema
const fakeValues = function({ request }) {
  const schema = getRequestJsonSchema({ request })
  const values = generateFromSchema({ schema })
  const requestA = addGeneratedValues({ values, request })
  return requestA
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
  const requestA = request.map(({ location, name, schema }) => ({
    [`${location}.${name}`]: schema,
  }))
  const properties = Object.assign({}, ...requestA)
  return properties
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

module.exports = {
  fakeValues,
}
