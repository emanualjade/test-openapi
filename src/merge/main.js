'use strict'

const { mergeRequest } = require('./request')
const { mergeResponse } = require('./response')

// Merge test options to specification
const mergeTest = function({ test }) {
  const request = mergeRequest({ test })
  const response = mergeResponse({ test })

  return { request, response }
}

module.exports = {
  mergeTest,
}
