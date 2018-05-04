'use strict'

const { capitalizeHeader } = require('../utils')
const { filterParams } = require('./utils')

// Build request headers from OpenAPI specification `parameters`
const getReqHeaders = function({ params }) {
  const headerParams = filterParams({ params, location: 'header' })
  const headers = headerParams.map(({ name, value }) => ({ [capitalizeHeader({ name })]: value }))
  const headersA = Object.assign({}, ...headers)
  return headersA
}

module.exports = {
  getReqHeaders,
}
