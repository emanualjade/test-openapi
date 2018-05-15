'use strict'

const { throwTestError } = require('../errors')

const { isSameParam, isSameHeader } = require('./common')

// `test.request.*` must be present in the specification.
// Otherwise this indicates a typo, or the specification can be improved
const validateTestParam = function({ testParam, parameters, name }) {
  const matchesSpec = parameters.some(param => isSameParam(param, testParam))
  if (matchesSpec) {
    return
  }

  const property = `request.${name}`
  throwTestError(`'${property}' does not match any request parameter in the specification`, {
    property,
  })
}

// Same for `test.response.headers.*`
const validateTestHeader = function({ testHeader, testHeader: { name }, headers }) {
  const matchesSpec = headers.some(param => isSameHeader(param, testHeader))
  if (matchesSpec) {
    return
  }

  const property = `response.headers.${name}`
  throwTestError(`'${property}' does not match any response header in the specification`, {
    property,
  })
}

module.exports = {
  validateTestParam,
  validateTestHeader,
}
