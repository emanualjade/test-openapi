'use strict'

const { unset } = require('lodash/fp')

// Remove `params.*` which value is `nothing` even when there are some required
// OpenAPI parameters.
// We only need to remove in `params.*` since special values like `nothing`
// already got removed from `call.*`.
const removeNothingParams = function({ params, specialValues: { nothing } }) {
  return nothing.reduce(removeNothingParam, params)
}

const removeNothingParam = function(params, path) {
  return unset(path, params)
}

module.exports = {
  removeNothingParams,
}
