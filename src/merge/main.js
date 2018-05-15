'use strict'

const { mergeRequest } = require('./request')
const { mergeResponse } = require('./response')
const { validateTest } = require('./validate')

// Merge test options to specification
const mergeTest = function({ test }) {
  const request = mergeRequest({ test })
  const response = mergeResponse({ test })

  validateTest({ request, response })

  return { request, response }
}

module.exports = {
  mergeTest,
}
