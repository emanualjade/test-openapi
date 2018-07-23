'use strict'

// Exceptions thrown during template evaluation
const templateHandler = function(error, { template, data, path }) {
  appendMessage({ error, template })

  setErrorProps({ error, data, path })

  throw error
}

const appendMessage = function({ error, template: { name } }) {
  const message = getMessage({ error })
  error.message = `${TEMPLATE_ERROR_MESSAGE} '${name}': ${message}`
}

// Avoid adding it several times on recursion
const getMessage = function({ error: { message } }) {
  if (!message.startsWith(TEMPLATE_ERROR_MESSAGE)) {
    return message
  }

  return message.replace(/^[^:]*: /, '')
}

const TEMPLATE_ERROR_MESSAGE = 'Error when evaluating template'

// Attach error properties to every error thrown during template evaluation:
// function-thrown error, recursion error:
//  - `property`: path to template variable
//  - `value`: `{$$FUNC: arg}` or `$$NAME`
// In case of recursive template, the top-level node should prevail.
const setErrorProps = function({ error, data, path }) {
  const property = path.join('.')
  Object.assign(error, { property, value: data })
  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

module.exports = {
  templateHandler,
}
