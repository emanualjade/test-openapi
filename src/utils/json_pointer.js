'use strict'

const { getPath } = require('./path')

// Transform a JSON pointer into a JavaScript property path
const jsonPointerToPath = function(jsonPointer) {
  const parts = jsonPointerToParts(jsonPointer)
  // Transform to properly escaped JavaScript property path
  const path = getPath(parts)
  return path
}

const jsonPointerToParts = function(jsonPointer) {
  const jsonPointerA = decodeUriFragment({ jsonPointer })

  const jsonPointerB = jsonPointerA.replace(/^\//, '')

  if (jsonPointerB === '') {
    return ''
  }

  const parts = jsonPointerB
    .split('/')
    .map(unescapeJsonPointer)
    .map(numerizeIndex)
  return parts
}

// JSON pointers used as URI fragments have extra escaping
const decodeUriFragment = function({ jsonPointer }) {
  // Not a URI fragment
  if (!jsonPointer.startsWith('#')) {
    return jsonPointer
  }

  const jsonPointerA = jsonPointer.replace(/^#/, '')
  // URI fragment percent decoding
  const jsonPointerB = decodeURIComponent(jsonPointerA)
  return jsonPointerB
}

// Remove JSON pointer's escaping of / and ~
const unescapeJsonPointer = function(jsonPointer) {
  return jsonPointer.replace(/~0/g, '~').replace(/~1/g, '/')
}

// Keep array indices as integers not strings
const numerizeIndex = function(value) {
  const valueA = Number(value)

  if (!Number.isInteger(valueA)) {
    return value
  }

  return valueA
}

module.exports = {
  jsonPointerToPath,
  jsonPointerToParts,
}
