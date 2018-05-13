'use strict'

const { mergeRequests } = require('./request')
const { mergeResponse } = require('./response')

// Merge test options to specification
const mergeTest = function({ test }) {
  const requests = mergeRequests({ test })
  const response = mergeResponse({ test })

  return { requests, response }
}

module.exports = {
  mergeTest,
}
