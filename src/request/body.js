'use strict'

const { filterParams } = require('./utils')

// Build request body from OpenAPI specification `parameters`
const getReqBody = function({ params }) {
  const bodyParams = filterParams({ params, location: 'body' })
  if (bodyParams.length !== 0) {
    return bodyParams[0].value
  }

  const formDataParams = filterParams({ params, location: 'formData' })
  if (formDataParams.length === 0) {
    // TODO: add support for sending `formData`
  }
}

module.exports = {
  getReqBody,
}
