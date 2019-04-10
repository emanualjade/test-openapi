import { crawl } from '../../../utils/crawl.js'

// Handle values in `call.*` that have special meanings:
//  - `valid` means `same as OpenAPI definition`
//  - `invalid` means `inverse of OpenAPI definition`
// Those are crawled, extracted and removed from `call.*`
export const getSpecialValues = function({ call }) {
  const specialValues = initSpecialValues()

  const callA = crawl(call, evalNode.bind(null, specialValues))

  return { call: callA, specialValues }
}

const initSpecialValues = function() {
  const specialValues = SPECIAL_VALUES.map(specialValue => ({
    [specialValue]: [],
  }))
  return Object.assign({}, ...specialValues)
}

const evalNode = function(specialValues, value, path) {
  // Can escape special values with a backslash
  if (ESCAPED_VALUES.includes(value)) {
    return value.replace(ESCAPING_CHAR, '')
  }

  // Not a special value: leave as is
  if (!SPECIAL_VALUES.includes(value)) {
    return value
  }

  // Keep track of paths of special values
  // eslint-disable-next-line fp/no-mutating-methods
  specialValues[value].push(path)

  // Return `undefined`, i.e. remove this node, otherwise it would have priority
  // over `spec` params
}

const SPECIAL_VALUES = ['valid', 'invalid']
const ESCAPING_CHAR = '\\'
const ESCAPED_VALUES = SPECIAL_VALUES.map(value => `${ESCAPING_CHAR}${value}`)
