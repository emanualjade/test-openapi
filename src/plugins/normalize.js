'use strict'

const { objectifyParams, objectifyResponse } = require('../utils')

// Return final value
const normalizeReturnValue = function({ params, response }) {
  const request = objectifyParams({ params })
  const responseA = normalizeResponse({ response })
  return { request, response: responseA }
}

// Return final response value
const normalizeResponse = function({ response }) {
  if (response === undefined) {
    return {}
  }

  const responseA = objectifyResponse({ response })
  return responseA
}

module.exports = {
  normalizeReturnValue,
}
