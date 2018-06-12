'use strict'

const { omitBy, mapValues } = require('lodash')

const { keysToObjects, keyToLocation, stringifyFlat } = require('../../../utils')
const { findBodyHandler } = require('../../format')

const { normalizeContentType } = require('./content_type')

// Stringify request parameters
const task = function({ call = {} }) {
  const callA = removeNull({ call })

  const callB = normalizeContentType({ call: callA })

  const request = keysToObjects(callB)

  const callC = mapValues(callB, stringifyParam)

  const rawRequest = keysToObjects(callC)
  const requestA = { ...request, raw: rawRequest }

  return { call: { ...call, request: requestA } }
}

// Specifying `null` means 'do not send this parameter'.
// Only applies to top-level value, i.e. should never be an issue.
// This is useful for:
//  - removing parameters specified by another plugin, i.e. removing parameters
//    specified by `spec` plugin
//  - distinguishing from `?queryVar` (empty string) and no `queryVar` (null)
//  - being consistent with `validate` plugin, which use `null` to specify
//    'should not be defined'
// When used with `random` plugin, parameters can be randomly generated or not
// using `type: ['null', ...]`
const removeNull = function({ call }) {
  return omitBy(call, value => value === null)
}

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

const PARAM_STRINGIFIERS = {
  method: stringifyParamFlat,
  server: stringifyParamFlat,
  path: stringifyParamFlat,
  url: stringifyParamFlat,
  query: stringifyParamFlat,
  headers: stringifyParamFlat,
  body: stringifyBody,
}

module.exports = {
  task,
}
