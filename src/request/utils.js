'use strict'

// Returns OpenAPI parameters with a specific `in`
const filterParams = function({ params, location }) {
  return params.filter(param => param.location === location)
}

module.exports = {
  filterParams,
}
