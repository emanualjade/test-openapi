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

const getBodyParam = function({ formDataParams }) {
  const value = getBodyValue({ formDataParams })
  // OpenAPI 2.0 `formData` parameters can be individually made required, but the
  // specification does not prescribe whether the request body is required or not.
  // So we assume it is.
  return { ...value, 'x-required': true }
}

// Transforms formData parameters to JSON schema:
//   { type: 'object', properties: { one: { ... }, two: { ... } }, required: ['one'] }
const getBodyValue = function({ formDataParams }) {
  const properties = mapKeys(formDataParams, (value, key) => removeFormDataPrefix(key))
  const required = getRequired({ properties })
  return { type: 'object', properties, required }
}

const getRequired = function({ properties }) {
  return Object.entries(properties)
    .filter(([, { 'x-required': required }]) => required)
    .map(([key]) => key)
}

// When using a `formData` parameter, make sure the `Content-Type` request header
// includes `urlencoded` or `multipart/form-data`
// When using a `body` parameter, do the opposite.
const filterFormDataMimes = function({ mimes, params }) {
  if (hasFormDataParams({ params })) {
    return keepFormDataMimes({ mimes })
  }

  return removeFormDataMimes({ mimes })
}

const hasFormDataParams = function({ params }) {
  return Object.keys(params).some(isFormData)
}

const keepFormDataMimes = function({ mimes }) {
  const mimesA = mimes.filter(isFormDataMime)

  // This means the spec `consumes` property does not allow `formData` MIMEs,
  // but some `formData` parameters are still used.
  // This is an error that we fix by adding the `formData` MIMEs
  if (mimesA.length === 0) {
    return FORM_DATA_MIMES
  }

  return mimesA
}

const removeFormDataMimes = function({ mimes }) {
  const mimesA = mimes.filter(mime => !isFormDataMime(mime))

  // This means the spec `consumes` property only allow `formData` MIMEs (not `body`),
  // but some `body` parameters are still used.
  // This is an error that we fix by keeping the `consumes` property as is.
  if (mimesA.length === 0) {
    return mimes
  }

  return mimesA
}

const isFormDataMime = function(mime) {
  return FORM_DATA_MIMES.some(formDataMime => mime.startsWith(formDataMime))
}

const FORM_DATA_MIMES = ['application/x-www-form-urlencoded', 'multipart/form-data']

module.exports = {
  normalizeFormData,
  filterFormDataMimes,
}
