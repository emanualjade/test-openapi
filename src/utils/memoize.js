'use strict'

const fastMemoize = require('fast-memoize')
const stableStringify = require('fast-json-stable-stringify')

// Simple memoize helper
const memoize = function(func) {
  return fastMemoize(func, { serializer: stableStringify })
}

module.exports = {
  memoize,
}
