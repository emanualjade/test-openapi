'use strict'

// Exceptions thrown by a helper
const helperHandler = function(error, { value, path }) {
  appendMessage({ error, value })

  setHelperErrorProps({ error, value, path })

  throw error
}

const appendMessage = function({ error, value }) {
  const message = getMessage({ error })
  error.message = `${HELPER_ERROR_MESSAGE} '${value}': ${message}`
}

// Avoid adding it several times on recursion
const getMessage = function({ error: { message } }) {
  if (!message.startsWith(HELPER_ERROR_MESSAGE)) {
    return message
  }

  return message.replace(/^[^:]*: /, '')
}

const HELPER_ERROR_MESSAGE = 'Error when evaluating helper'

// Attach error properties to every error thrown during helpers substitution:
// helper-thrown error, recursion error:
//  - `property`: path to helper
//  - `value`: `{$$FUNC: arg}` or `$$NAME`
// In case of recursive helper, the top-level node should prevail.
const setHelperErrorProps = function({ error, value, path }) {
  const property = path.join('.')
  Object.assign(error, { property, value })
  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

module.exports = {
  helperHandler,
}
