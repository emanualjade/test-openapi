'use strict'

// Exceptions thrown by a helper
const helperHandler = function(error, { value, helper, info }) {
  const { message } = error

  if (!message.includes(HELPER_ERROR_MESSAGE)) {
    error.message = `${HELPER_ERROR_MESSAGE}${message}`
  }

  setHelperErrorProps({ error, value, helper, info })

  throw error
}

// We don't show helper's name in error message because it would require replacing
// it for each recursion level in case of recursive helpers
const HELPER_ERROR_MESSAGE = 'Error when evaluating helper: '

// Attach error properties to every error thrown during helpers substitution:
// helper-thrown error, recursion error:
//  - `property`: `path.to.$$FUNC`
//  - `value`: `helperArg` (if function) or `value`: `helperValue` (if `value`)
// In case of recursive helper, the top-level node should prevail.
const setHelperErrorProps = function({ error, value, helper, info }) {
  const errorProps = getHelperErrorProps({ value, helper, info })
  Object.assign(error, errorProps)

  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

const getHelperErrorProps = function({ value, helper: { type, name, arg }, info: { path } }) {
  const property = [...path, name].join('.')

  if (type === 'function') {
    return { property, value: arg }
  }

  return { property, value }
}

module.exports = {
  helperHandler,
}
