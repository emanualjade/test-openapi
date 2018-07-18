'use strict'

// Exceptions thrown by a helper
const helperHandler = function(error, { value, helper, info, name }) {
  const { message } = error

  appendMessage({ error, message, name })

  setHelperErrorProps({ error, value, helper, info, name })

  throw error
}

const appendMessage = function({ error, message, name }) {
  const messageA = removePreviousMessage({ message })

  error.message = `${HELPER_ERROR_MESSAGE} '${name}': ${messageA}`
}

// Avoid adding it several times on recursion
const removePreviousMessage = function({ message }) {
  if (!message.startsWith(HELPER_ERROR_MESSAGE)) {
    return message
  }

  return message.replace(/^[^:]*: /, '')
}

const HELPER_ERROR_MESSAGE = 'Error when evaluating helper'

// Attach error properties to every error thrown during helpers substitution:
// helper-thrown error, recursion error:
//  - `property`: `path.to.$$FUNC`
//  - `value`: `helperArg` (if function) or `value`: `helperValue` (if `value`)
// In case of recursive helper, the top-level node should prevail.
const setHelperErrorProps = function({ error, value, helper, info, name }) {
  const errorProps = getHelperErrorProps({ value, helper, info, name })
  Object.assign(error, errorProps)

  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

const getHelperErrorProps = function({ value, helper: { type, arg }, info: { path }, name }) {
  const property = [...path, name].join('.')

  if (type === 'function') {
    return { property, value: arg }
  }

  return { property, value }
}

module.exports = {
  helperHandler,
}
