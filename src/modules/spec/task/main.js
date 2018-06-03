'use strict'

const { merge } = require('lodash')

const { mergeParams, mergeHeaders, getShortcut } = require('../../../utils')

const { getSpecOperation, getSpecResponse } = require('./operation')
const { mergeInvalidValue } = require('./invalid')

// Merge OpenAPI specification to `task.call.*`
const mergeSpecParams = function({ call: { params, ...call }, taskKey, config, plugins }) {
  // Optional dependency
  if (!plugins.includes('random')) {
    return
  }

  const specOperation = getSpecOperation({ taskKey, config })
  if (specOperation === undefined) {
    return
  }

  const paramsA = mergeParams([...specOperation.params, ...params], mergeSpecParam)
  return { call: { ...call, params: paramsA } }
}

// Merge a `task.call.*` value with the specification value
const mergeSpecParam = function({ value: specValue, ...specRest }, { value, isRandom, ...rest }) {
  const valueA = mergeSpecValue({ specValue, value, isRandom })
  return { ...specRest, ...rest, value: valueA, isRandom: true }
}

// Deep merge the JSON schemas
// Both `specValue` and `value` might be `undefined`
const mergeSpecValue = function({ specValue, value, isRandom }) {
  if (isRandom && value === 'invalid') {
    return mergeInvalidValue({ specValue })
  }

  const valueA = applyShortcut({ value, isRandom })

  return deepMerge(specValue, valueA)
}

// Returned value is always a JSON schema
const applyShortcut = function({ value, isRandom }) {
  if (isRandom) {
    return value
  }

  return getShortcut(value)
}

// Merge OpenAPI specification to `task.validate.*`
const mergeSpecValidate = function({
  taskKey,
  validate: { status, headers, body },
  call: {
    response: { raw: rawResponse },
  },
  config,
  plugins,
}) {
  // Optional dependency
  if (!plugins.includes('validate')) {
    return
  }

  const specResponse = getSpecResponse({ taskKey, config, rawResponse })
  if (specResponse === undefined) {
    return
  }

  const headersA = mergeHeaders([...specResponse.headers, ...headers], deepMerge)
  const bodyA = deepMerge(specResponse.body, body)

  return { validate: { status, headers: headersA, body: bodyA } }
}

const deepMerge = function(valueA, valueB) {
  return merge({}, valueA, valueB)
}

module.exports = {
  mergeSpecParams,
  mergeSpecValidate,
}
