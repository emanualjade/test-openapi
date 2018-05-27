'use strict'

const { locationToKey } = require('../../../utils')

const { generateFromSchema } = require('./faker')

// Generates random values based on JSON schema
const fakeValues = function({ params }) {
  const schema = getParamsJsonSchema({ params })
  const values = generateFromSchema({ schema })
  const paramsA = addGeneratedValues({ values, params })
  return paramsA
}

// Transform OpenAPI parameters into a single JSON schema
const getParamsJsonSchema = function({ params }) {
  const required = getRequired({ params })

  const properties = getProperties({ params })

  const schema = { type: 'object', properties, required }
  return schema
}

// OpenAPI `required` to JSON schema `required`
const getRequired = function({ params }) {
  return params.filter(({ required }) => required).map(locationToKey)
}

// Transform OpenAPI parameter into a JSON schema of `type: object`
const getProperties = function({ params }) {
  const paramsA = params.map(getSchema)
  const properties = Object.assign({}, ...paramsA)
  return properties
}

const getSchema = function({ location, name, value }) {
  const key = locationToKey({ location, name })

  const valueA = fixArray({ value })

  return { [key]: valueA }
}

// json-schema-faker does not work properly with array schema that do not have
// an `items.type` property
const fixArray = function({ value, value: { type, items = {} } }) {
  if (type !== 'array' || items.type !== undefined) {
    return value
  }

  return { ...value, items: { ...items, type: 'string' } }
}

// Merge generated values back to original request parameters as `param.value`
const addGeneratedValues = function({ values, params }) {
  return params.map(param => addGeneratedValue({ values, param })).filter(shouldIncludeParam)
}

const addGeneratedValue = function({ values, param, param: { location, name } }) {
  const key = locationToKey({ location, name })
  const value = values[key]
  return { ...param, value }
}

const shouldIncludeParam = function({ value }) {
  return (
    // Optional request parameters that have not been picked
    value !== undefined &&
    // Specifying `type: 'null'` or `enum: ['null']` means 'do not send this parameter'
    // Specifying `type: ['null', ...]` means 'maybe send this parameter (or not, randomly)'
    // No matter what, only required parameters or parameters specified in
    // `task.parameters.*` can be sent
    value !== null
  )
}

module.exports = {
  fakeValues,
}
