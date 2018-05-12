'use strict'

const { filterRequest } = require('../utils')

// Build request body from OpenAPI specification request `parameters`
const getRequestBody = function({ request }) {
  const bodyRequest = filterRequest({ request, location: 'body' })
  if (bodyRequest.length !== 0) {
    return bodyRequest[0].value
  }

  const formDataRequest = filterRequest({ request, location: 'formData' })
  if (formDataRequest.length === 0) {
    // TODO: add support for sending `formData`
  }
}

module.exports = {
  getRequestBody,
}
