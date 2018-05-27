'use strict'

// Merge `formData` parameters into a single `task.call.body` parameter
const normalizeFormData = function({ params }) {
  const { formDataParams, params: paramsA } = splitParams({ params })

  if (formDataParams.length === 0) {
    return paramsA
  }

  const bodyParam = getBodyParam({ formDataParams })
  const paramsB = [...paramsA, bodyParam]

  return paramsB
}

const splitParams = function({ params }) {
  const formDataParams = params.filter(isFormData)
  const paramsA = params.filter(param => !isFormData(param))
  return { formDataParams, params: paramsA }
}

const isFormData = function({ location }) {
  return location === 'formData'
}

const getBodyParam = function({ formDataParams }) {
  const value = getBodyValue({ formDataParams })
  const collectionFormat = getCollectionFormat({ formDataParams })
  return { ...BODY_PARAM, value, collectionFormat }
}

// OpenAPI 2.0 `formData` parameters can be individually made required, but the
// specification does not prescribe whether the request body is required or not.
// So we assume it is.
const BODY_PARAM = { name: 'body', location: 'body', required: true }

// Transforms formData parameters:
//  [{ name: 'one', location: 'formData', required: true, value: { ... } },
//   { name: 'two', location: 'formData', required: false, value: { ... } }]
// To JSON schema:
//  { type: 'object', properties: { one: { ... }, two: { ... } }, required: ['one'] }
const getBodyValue = function({ formDataParams }) {
  const properties = getProperties({ formDataParams })
  const required = getRequired({ formDataParams })
  return { type: 'object', properties, required }
}

const getProperties = function({ formDataParams }) {
  const properties = formDataParams.map(({ name, value }) => ({ [name]: value }))
  const propertiesA = Object.assign({}, ...properties)
  return propertiesA
}

const getRequired = function({ formDataParams }) {
  return formDataParams.filter(({ required }) => required).map(({ name }) => name)
}

// `formData` parameters might have different `collectionFormat` but since we
// merge to a single body parameter, we can only pick one
const getCollectionFormat = function({ formDataParams }) {
  const { collectionFormat: collectionFormatA } =
    formDataParams.find(({ collectionFormat }) => collectionFormat !== undefined) || {}
  return collectionFormatA
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
  return params.some(isFormData)
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
