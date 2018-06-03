'use strict'

const { merge } = require('lodash')

const { mergeParams, mergeHeaders, getShortcut } = require('../../../utils')

const { getSpecOperation, getSpecResponse } = require('./operation')
const { isInvalidFormat, mergeInvalidFormat } = require('./invalid')

// Merge OpenAPI specification to `task.call.*`
const mergeSpecParams = function({ call: { params, ...call }, key, config, pluginNames }) {
  // Optional dependency
  if (!pluginNames.includes('random')) {
    return
  }

  const specOperation = getSpecOperation({ key, config })
  if (specOperation === undefined) {
    return
  }

  const paramsA = mergeParams([...specOperation.params, ...params], mergeSpecParam)
  return { call: { ...call, params: paramsA } }
}

// Merge a `task.call.*` value with the specification value
const mergeSpecParam = function(specParam, param) {
  const value = mergeSpecValue({ specParam, param })
  return { ...specParam, ...param, value, isRandom: true }
}

// Deep merge the JSON schemas
// Both `specParam.value` and `param.value` might be `undefined`
// Both might not be a JSON schema
const mergeSpecValue = function({ specParam, param }) {
  const specParamValue = applyShortcut(specParam)

  if (isInvalidFormat(param)) {
    return mergeInvalidFormat({ specParamValue })
  }

  const paramValue = applyShortcut(param)

  return deepMerge(specParamValue, paramValue)
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
  key,
  validate,
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

  const {
    schemas: { status, headers, body },
  } = validate
  const headersA = mergeHeaders([...specResponse.headers, ...headers], deepMerge)
  const bodyA = deepMerge(specResponse.body, body)
  const schemas = { status, headers: headersA, body: bodyA }

  return { validate: { ...validate, schemas } }
}

const deepMerge = function(valueA, valueB) {
  return merge({}, valueA, valueB)
}

module.exports = {
  mergeSpecParams,
  mergeSpecValidate,
}
