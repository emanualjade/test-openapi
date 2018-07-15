'use strict'

const { omit } = require('lodash')

// Using `task.call.*: 'invalid value'` inverse OpenAPI specification parameters
const handleInvalid = function({ params, call = {} }) {
  const keys = Object.keys(call).filter(key => isInvalid({ call, key }))

  // Otherwise `task.call` has priority over OpenAPI parameters
  const callA = omit(call, keys)

  const paramsA = getInvalidParams({ params, keys })

  return { call: callA, params: paramsA }
}

const isInvalid = function({ call, key }) {
  return call[key] === INVALID_TOKEN
}

// We do not provide a way to escape, i.e. when users actually want to use
// a parameter with this string value, because it is unlikely
const INVALID_TOKEN = 'invalid value'

const getInvalidParams = function({ params, keys }) {
  const invalidParams = keys.map(key => getInvalidParam({ params, key }))
  const paramsA = Object.assign({}, params, ...invalidParams)
  return paramsA
}

const getInvalidParam = function({ params, key }) {
  const param = params[key]

  const type = addNullType({ param })

  // TODO: json-schema-faker support for the `not` keyword is lacking
  // E.g. `type` array is not supported, so `invalid value` actually does not work
  // at the moment.
  return { [key]: { not: { ...param, type } } }
}

// When using 'invalid value', we want to make sure the value is generated, i.e. it
// should never be `null`
// If `param` is `undefined`, nothing to negate, but it should still be generated,
// i.e. will return `['null']`
// TODO: use `{ allOf: [{ not: { enum: [null] } }, ...] }` instead
// This is unfortunately not supported at the moment by json-schema-faker
const addNullType = function({ param: { type = [] } = {} }) {
  if (type === 'null') {
    return type
  }

  if (!Array.isArray(type)) {
    return ['null', type]
  }

  if (type.includes('null')) {
    return type
  }

  return ['null', ...type]
}

module.exports = {
  handleInvalid,
}
