'use strict'

// Exceptions thrown by a helper
const helperHandler = function(error, { helper, data, path }) {
  appendMessage({ error, helper })

  setHelperErrorProps({ error, data, path })

  throw error
}

const appendMessage = function({ error, helper: { name } }) {
  const message = getMessage({ error })
  error.message = `${HELPER_ERROR_MESSAGE} '${name}': ${message}`
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
const setHelperErrorProps = function({ error, data, path }) {
  const property = path.join('.')
  Object.assign(error, { property, value: data })
  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

module.exports = {
  helperHandler,
}
