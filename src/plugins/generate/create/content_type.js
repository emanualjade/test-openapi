'use strict'

const { generateFromSchema } = require('./faker')

// `Content-Type` value generation has extra constraints:
//  - it should be empty if no request body is going to be sent
//  - it should include or exclude `multipart/form-data` and `application/x-www-form-urlencoded`
//    depending on whether the request parameter is a `body` or a `formData`
const fakeContentType = function({ params }) {
  const [contentTypeParam, paramsA] = extractContentTypeParam({ params })

  const reqBodyType = getReqBodyType({ params: paramsA })

  const contentTypeParamA = normalizeContentType({ contentTypeParam, reqBodyType })
  const paramsB = [...contentTypeParamA, ...paramsA]

  return paramsB
}

// Extract the `Content-Type` header request parameter from others
const extractContentTypeParam = function({ params }) {
  const contentTypeParam = params.find(isContentTypeParam) || DEFAULT_CONTENT_TYPE
  const paramsA = params.filter(param => !isContentTypeParam(param))
  return [contentTypeParam, paramsA]
}

const isContentTypeParam = function({ location, name }) {
  return location === 'headers' && name.toLowerCase() === 'content-type'
}

// Default request `Content-Type` according to HTTP is `application/octet-stream`
const DEFAULT_CONTENT_TYPE = {
  name: 'Content-Type',
  location: 'headers',
  schema: { type: 'string', enum: ['application/octet-stream'] },
}

// Retrieve whether there is a request body and whether it is of `body` or `formData` type
const getReqBodyType = function({ params }) {
  const param = params.find(({ location }) => location === 'body')
  if (param === undefined) {
    return
  }

  if (param.name === 'body') {
    return 'body'
  }

  return 'formData'
}

const normalizeContentType = function({ contentTypeParam, reqBodyType }) {
  // If there is no request body, there is no `Content-Type` header
  if (reqBodyType === undefined) {
    return []
  }

  const contentTypeParamA = { ...contentTypeParam, required: true }

  const contentTypeParamB = filterReqBodyMimes({ contentTypeParam: contentTypeParamA, reqBodyType })

  const contentTypeParamC = generateContentType({ contentTypeParam: contentTypeParamB })

  return [contentTypeParamC]
}

// Must use `formData` request parameter if `x-www-form-urlencoded` or `multipart/form-data`
// Must use `body` request parameter otherwise
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

const DEFAULT_REQ_BODY_MIME = {
  formData: 'application/x-www-form-urlencoded',
  body: 'application/octet-stream',
}

// Generate random `Content-Type`
const generateContentType = function({ contentTypeParam, contentTypeParam: { schema } }) {
  const value = generateFromSchema({ schema })
  return { ...contentTypeParam, value }
}

module.exports = {
  fakeContentType,
}
