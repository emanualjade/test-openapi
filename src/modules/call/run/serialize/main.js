'use strict'

const { omitBy, mapValues } = require('lodash')

const { keyToLocation, stringifyFlat } = require('../../../../utils')
const { findBodyHandler } = require('../../body')

const { normalizeContentType } = require('./content_type')
const { normalizeMethod } = require('./method')

// Serialize request parameters
const serialize = function({ call }) {
  if (call === undefined) {
    return
  }

  const callA = removeNull({ call })

  const callB = normalizeContentType({ call: callA })

  const callC = normalizeMethod({ call: callB })

  const request = normalizeTimeout({ call: callC })

  const rawRequest = mapValues(request, stringifyParam)

  return { call: { ...call, request, rawRequest } }
}

// Specifying `null` means 'do not send this parameter'.
// Only applies to top-level value, i.e. should never be an issue.
// This is useful for:
//  - removing parameters specified by another plugin, i.e. removing parameters
//    specified by `spec` plugin
//  - distinguishing from `?queryVar` (empty string) and no `queryVar` (null)
//  - being consistent with `validate` plugin, which use `null` to specify
//    'should not be defined'
// When used with `$$random` helper, parameters can be randomly generated or not
// using `type: ['null', ...]`
const removeNull = function({ call }) {
  return omitBy(call, value => value === null)
}

const normalizeTimeout = function({ call: { timeout = DEFAULT_TIMEOUT, ...call } }) {
  return { ...call, timeout }
}

const DEFAULT_TIMEOUT = 1e4

const stringifyParam = function(value, key, call) {
  const { location } = keyToLocation({ key })
  return PARAM_STRINGIFIERS[location]({ value, call })
}

// `url`, `query` and `header` values might not be strings.
// In which case they are JSON stringified
const stringifyParamFlat = function({ value }) {
  return stringifyFlat(value)
}

// Stringify the request body according to HTTP request header `Content-Type`
const stringifyBody = function({ value, call: { 'headers.content-type': contentType } }) {
  // Default stringifiers tries JSON.stringify()
  const { stringify = stringifyFlat } = findBodyHandler({ mime: contentType })

  return stringify(value)
}

// Keep `timeout` as an integer, and assign default value
const keepAsIs = function({ value }) {
  return value
}

const PARAM_STRINGIFIERS = {
  method: stringifyParamFlat,
  server: stringifyParamFlat,
  path: stringifyParamFlat,
  url: stringifyParamFlat,
  query: stringifyParamFlat,
  headers: stringifyParamFlat,
  body: stringifyBody,
  timeout: keepAsIs,
}

module.exports = {
  serialize,
}
