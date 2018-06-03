'use strict'

const { write } = require('./write')

// Validate and normalize `keys` input
const getKeysCount = function({ count, keys }) {
  if (keys === undefined) {
    return { count }
  }

  validateKeys({ keys })

  if (count === undefined) {
    return { count: keys.length, keys }
  }

  if (count !== keys.length) {
    throw new Error(`'keys' length should be same as 'count'`)
  }

  return { count, keys }
}

const validateKeys = function({ keys }) {
  const isValid = Array.isArray(keys) && keys.every(key => typeof key === 'string')
  if (isValid) {
    return
  }

  throw new Error("'keys' should be an array of strings")
}

// Ensure TAP output is ordered
// Order is specify during initialization with `keys` array
// Each assert must specify a `key` string. It will be buffered according to
// `keys` order.
const writeAssert = function(tap, assertString, key) {
  const { keys, asserts } = tap
  if (keys === undefined) {
    return write(tap, assertString)
  }

  if (!keys.includes(key)) {
    throw new Error(`key '${key}' is not among possible 'keys'`)
  }

  asserts[key] = assertString

  const assertsString = unbufferAsserts({ tap })

  if (assertsString === '') {
    return ''
  }

  return write(tap, assertsString)
}

// Unbuffer/write all asserts that are available from the `keys` order
const unbufferAsserts = function({ tap, tap: { asserts } }) {
  const keysA = getKeys({ tap })

  return keysA.map(key => asserts[key]).join('\n\n')
}

const getKeys = function({ tap, tap: { index, keys, asserts } }) {
  const keysA = keys.slice(index)

  // The Symbol will never be matched, i.e. serves as a end-of-array delimiter
  const [count] = Object.entries([...keysA, Symbol('')]).find(
    ([, key]) => asserts[key] === undefined,
  )
  const countA = Number(count)

  tap.index += countA

  const keysB = keysA.slice(0, countA)
  return keysB
}

module.exports = {
  getKeysCount,
  writeAssert,
}
