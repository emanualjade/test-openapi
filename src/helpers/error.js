'use strict'

// Exceptions thrown by a helper
const helperHandler = function(error, { value, helper, opts, name }) {
  const { message } = error

  appendMessage({ error, message, name })

  setHelperErrorProps({ error, value, helper, opts, name })

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
const setHelperErrorProps = function({ error, value, helper, opts, name }) {
  const errorProps = getHelperErrorProps({ value, helper, opts, name })
  Object.assign(error, errorProps)
}

const getHelperErrorProps = function({ value, helper: { type, arg }, opts: { path }, name }) {
  const property = [...path, name].join('.')

  if (type === 'function') {
    return { property, value: arg, expected: undefined }
  }

  // `error.expected` does not make any more sense since we remove `error.value`
  return { property, value, expected: undefined }
}

module.exports = {
  helperHandler,
}
