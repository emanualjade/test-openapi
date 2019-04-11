// Transform a JSON pointer into a JavaScript property path
export const jsonPointerToParts = function(jsonPointer) {
  const jsonPointerA = decodeUriFragment({ jsonPointer })

  const jsonPointerB = jsonPointerA.replace(START_SLASH_REGEXP, '')

  if (jsonPointerB === '') {
    return ''
  }

  const parts = jsonPointerB
    .split('/')
    .map(unescapeJsonPointer)
    .map(numerizeIndex)
  return parts
}

const START_SLASH_REGEXP = /^\//u

// JSON pointers used as URI fragments have extra escaping
const decodeUriFragment = function({ jsonPointer }) {
  // Not a URI fragment
  if (!jsonPointer.startsWith('#')) {
    return jsonPointer
  }

  const jsonPointerA = jsonPointer.replace(START_HASH_REGEXP, '')
  // URI fragment percent decoding
  const jsonPointerB = decodeURIComponent(jsonPointerA)
  return jsonPointerB
}

const START_HASH_REGEXP = /^#/u

// Remove JSON pointer's escaping of / and ~
const unescapeJsonPointer = function(jsonPointer) {
  return jsonPointer
    .replace(ESCAPED_TILDE_REGEXP, '~')
    .replace(ESCAPED_SLASH_REGEXP, '/')
}

const ESCAPED_TILDE_REGEXP = /~0/gu
const ESCAPED_SLASH_REGEXP = /~1/gu

// Keep array indices as integers not strings
const numerizeIndex = function(value) {
  const valueA = Number(value)

  if (!Number.isInteger(valueA)) {
    return value
  }

  return valueA
}
