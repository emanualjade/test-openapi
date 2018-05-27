'use strict'

// Returns OpenAPI request parameters with a specific `in`
const filterRequest = function({ request, location }) {
  return request.filter(param => param.location === location)
}

module.exports = {
  filterRequest,
}
