'use strict'

const { crawl } = require('../../../utils')

// Handle values in `call.*` that have special meanings:
//  - `valid` means `same as OpenAPI definition`
//  - `invalid` means `inverse of OpenAPI definition`
// Those are crawled, extracted and removed from `call.*`
const getSpecialValues = function({ call }) {
  const specialValues = initSpecialValues()

  const callA = crawl(call, evalNode, { info: specialValues })

  return { call: callA, specialValues }
}

const initSpecialValues = function() {
  const specialValues = SPECIAL_VALUES.map(specialValue => ({ [specialValue]: [] }))
  return Object.assign({}, ...specialValues)
}

const evalNode = function(value, path, specialValues) {
  // Can escape special values with a backslash
  if (ESCAPED_VALUES.includes(value)) {
    return value.replace(ESCAPING_CHAR, '')
  }

  // Not a special value: leave as is
  if (!SPECIAL_VALUES.includes(value)) {
    return value
  }

  // Keep track of paths of special values
  specialValues[value].push(path)

  // Return `undefined`, i.e. remove this node, otherwise it would have priority
  // over `spec` params
}

const SPECIAL_VALUES = ['valid', 'invalid']
const ESCAPING_CHAR = '\\'
const ESCAPED_VALUES = SPECIAL_VALUES.map(value => `${ESCAPING_CHAR}${value}`)

module.exports = {
  getSpecialValues,
}
