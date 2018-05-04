'use strict'

const { generateFromSchema } = require('../../utils')

// Generates random values based on JSON schema
const fakeValues = function({ params }) {
  const schema = getParamsJsonSchema({ params })
  const values = generateFromSchema({ schema })
  const paramsA = addFakeParams({ values, params })
  return paramsA
}

// Transform OpenAPI parameters into a single JSON schema
const getParamsJsonSchema = function({ params }) {
  const required = getRequiredParams({ params })

  const properties = getProperties({ params })

  const schema = { type: 'object', properties, required }
  return schema
}

// OpenAPI `required` to JSON schema `required`
const getRequiredParams = function({ params }) {
  return params
    .filter(({ required }) => required)
    .map(({ location, name }) => `${location}_${name}`)
}

// Transform OpenAPI parameter into a JSON schema of `type: object`
const getProperties = function({ params }) {
  const paramsA = params.map(({ location, name, schema }) => ({ [`${location}_${name}`]: schema }))
  const properties = Object.assign({}, ...paramsA)
  return properties
}

// Merge generated value back to original parameters as `param.value`
const addFakeParams = function({ values, params }) {
  return (
    params
      .map(param => addFakeParam({ values, param }))
      // Optional parameters that have not been picked
      .filter(({ value }) => value !== undefined)
  )
}

const addFakeParam = function({ values, param, param: { location, name } }) {
  const value = values[`${location}_${name}`]
  return { ...param, value }
}

module.exports = {
  fakeValues,
}
