'use strict'

const { omitBy, pickBy, mapKeys } = require('lodash')

const { isFormData, removeFormDataPrefix } = require('../form_data')

// Merge `formData` parameters into a single `task.call.body` parameter
const normalizeFormData = function({ params }) {
  const { formDataParams, params: paramsA } = splitParams({ params })

  if (Object.keys(formDataParams).length === 0) {
    return paramsA
  }

  const body = getBodyParam({ formDataParams })
  const paramsB = { ...paramsA, body }

  return paramsB
}

const splitParams = function({ params }) {
  const formDataParams = pickBy(params, (value, key) => isFormData(key))
  const paramsA = omitBy(params, (value, key) => isFormData(key))
  return { formDataParams, params: paramsA }
}

// Transforms formData parameters to JSON schema:
//   { type: 'object', properties: { one: { ... }, two: { ... } }, required: ['one'] }
// OpenAPI 2.0 `formData` parameters can be individually made required, but the
// specification does not prescribe whether the request body is required or not.
// So we assume it is.
const getBodyParam = function({ formDataParams }) {
  const properties = mapKeys(formDataParams, (value, key) => removeFormDataPrefix(key))
  const required = getRequired({ properties })
  return { type: 'object', properties, required }
}

const getRequired = function({ properties }) {
  return Object.entries(properties)
    .filter(([, { optional }]) => !optional)
    .map(([key]) => key)
}

module.exports = {
  normalizeFormData,
}
