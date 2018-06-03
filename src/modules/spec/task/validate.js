'use strict'

const { mergeHeaders, deepMerge } = require('../../../utils')

const { getSpecResponse } = require('./operation')

// Merge OpenAPI specification to `task.validate.*`
const mergeSpecValidate = function({
  key,
  validate,
  validate: { schemas: { status, headers, body } = {} } = {},
  call: {
    response: { raw: rawResponse },
  },
  config,
  pluginNames,
}) {
  // Optional dependency
  if (!pluginNames.includes('validate')) {
    return
  }

  const specResponse = getSpecResponse({ key, config, rawResponse })
  if (specResponse === undefined) {
    return
  }

  const headersA = mergeHeaders([...specResponse.headers, ...headers], deepMerge)
  const bodyA = deepMerge(specResponse.body, body)
  const schemas = { status, headers: headersA, body: bodyA }

  return { validate: { ...validate, schemas } }
}

module.exports = {
  mergeSpecValidate,
}
