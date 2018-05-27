'use strict'

const { filterRequest } = require('./utils')

// Build request headers from OpenAPI specification request `parameters`
const getRequestHeaders = function({ request }) {
  const headerRequest = filterRequest({ request, location: 'header' })
  const headers = headerRequest.map(({ name, value }) => ({ [name]: value }))
  const headersA = Object.assign({}, ...headers)
  return headersA
}

module.exports = {
  getRequestHeaders,
}
