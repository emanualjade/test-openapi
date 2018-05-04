'use strict'

const { generateFromSchema } = require('../../utils')
const { DEFAULT_REQ_BODY_MIME } = require('../../format')

// `Content-Type` value generation has extra constraints:
//  - it should be empty if no request body is going to be sent
//  - it should include or exclude `multipart/form-data` and `application/x-www-form-urlencoded`
//    depending on whether the parameter is a `body` or a `formData`
const fakeContentType = function({ params }) {
  const [contentTypeParam, paramsA] = extractContentTypeParam({ params })

  const reqBodyType = getReqBodyType({ params })

  const contentTypeParamA = normalizeContentType({ contentTypeParam, reqBodyType })
  const paramsB = [...contentTypeParamA, ...paramsA]

  const contentType = getReqContentType({ contentTypeParam: contentTypeParamA })
  return { params: paramsB, contentType }
}

// Extract the `Content-Type` header parameter from other parameters
const extractContentTypeParam = function({ params }) {
  const contentTypeParam = params.find(param => isContentTypeParam({ param }))
  const paramsA = params.filter(param => !isContentTypeParam({ param }))
  return [contentTypeParam, paramsA]
}

const isContentTypeParam = function({ param: { location, name } }) {
  return location === 'header' && name.toLowerCase() === 'content-type'
}

// Retrieve whether there is a request body and whether it is of `body` or `formData` type
const getReqBodyType = function({ params }) {
  const { location } = params.find(isReqBodyParam) || {}
  return location
}

const isReqBodyParam = function({ location }) {
  return REQ_BODY_LOCATIONS.includes(location)
}

const REQ_BODY_LOCATIONS = ['formData', 'body']

const normalizeContentType = function({ contentTypeParam, reqBodyType }) {
  // If there is no request body, there is no `Content-Type` header
  if (reqBodyType === undefined) {
    return []
  }

  const contentTypeParamA = addDefaultContentType({ contentTypeParam })

  const contentTypeParamB = { ...contentTypeParamA, required: true }

  const contentTypeParamC = filterReqBodyMimes({ contentTypeParam: contentTypeParamB, reqBodyType })

  const contentTypeParamD = generateContentType({ contentTypeParam: contentTypeParamC })

  return [contentTypeParamD]
}

// Default request `Content-Type` according to HTTP is `application/octet-stream`
const addDefaultContentType = function({ contentTypeParam }) {
  if (contentTypeParam !== undefined) {
    return contentTypeParam
  }

  return DEFAULT_CONTENT_TYPE_PARAM
}

const DEFAULT_CONTENT_TYPE_PARAM = {
  name: 'content-type',
  location: 'header',
  schema: { type: 'string', enum: ['application/octet-stream'] },
}

// Must use `formData` parameter if `x-www-form-urlencoded` or `multipart/form-data`
// Must use `body` parameter otherwise
const filterReqBodyMimes = function({
  contentTypeParam,
  contentTypeParam: {
    schema,
    schema: { enum: mimes = [] },
  },
  reqBodyType,
}) {
  const mimesA = filterFormDataMime({ reqBodyType, mimes })
  const mimesB = addDefaultReqBodyMime({ reqBodyType, mimes: mimesA })
  const contentTypeParamA = { ...contentTypeParam, schema: { ...schema, enum: mimesB } }
  return contentTypeParamA
}

const filterFormDataMime = function({ reqBodyType, mimes }) {
  if (reqBodyType === 'formData') {
    return mimes.filter(mime => isFormDataMime({ mime }))
  }

  return mimes.filter(mime => !isFormDataMime({ mime }))
}

const isFormDataMime = function({ mime }) {
  return FORM_DATA_MIMES.some(formDataMime => mime.startsWith(formDataMime))
}

const FORM_DATA_MIMES = ['application/x-www-form-urlencoded', 'multipart/form-data']

// Make sure there is a `Content-Type` header if there is a request body
const addDefaultReqBodyMime = function({ reqBodyType, mimes }) {
  if (mimes.length !== 0) {
    return mimes
  }

  return [DEFAULT_REQ_BODY_MIME[reqBodyType]]
}

// Generate random `Content-Type`
const generateContentType = function({ contentTypeParam, contentTypeParam: { schema } }) {
  const value = generateFromSchema({ schema })
  return { ...contentTypeParam, value }
}

// Retrieve the `Content-Type` header to set in the request
const getReqContentType = function({ contentTypeParam }) {
  if (contentTypeParam.length === 0) {
    return
  }

  const [{ value: contentType }] = contentTypeParam
  return contentType
}

module.exports = {
  fakeContentType,
}
