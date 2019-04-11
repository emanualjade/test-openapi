import { omit } from 'lodash'

import { getPath } from '../utils/path.js'

// Exceptions thrown during template evaluation
export const templateHandler = function(error, { template, data, path }) {
  appendMessage({ error, template })

  setErrorProps({ error, data, path })

  throw error
}

const appendMessage = function({ error, template: { name } }) {
  const message = getMessage({ error })
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.message = `${TEMPLATE_ERROR_MESSAGE} '${name}': ${message}`
}

// Avoid adding it several times on recursion
const getMessage = function({ error: { message } }) {
  if (!message.startsWith(TEMPLATE_ERROR_MESSAGE)) {
    return message
  }

  return message.replace(TEMPLATE_ERROR_REGEXP, '')
}

const TEMPLATE_ERROR_REGEXP = /^[^:]*: /u
const TEMPLATE_ERROR_MESSAGE = 'Error when evaluating template'

// Attach error properties to every error thrown during template evaluation:
// function-thrown error, recursion error:
//  - `property`: path to template variable
//  - `value`: `{$$FUNC: arg}` or `$$NAME`
// In case of recursive template, the top-level node should prevail.
const setErrorProps = function({ error, data, path }) {
  const property = getPath(path)

  // We move template error attributes from `error.*` to `error.value.*`
  // to allow `error.*` to set its own attributes, e.g. `error.property` below
  const errorProps = omit(error, KEPT_ERROR_PROPS)
  // eslint-disable-next-line fp/no-delete, no-param-reassign
  Object.keys(errorProps).forEach(errorProp => delete error[errorProp])
  const value = { template: data, ...errorProps }

  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { property, value })
}

// Do not move those error properties
const KEPT_ERROR_PROPS = ['name', 'nested']
