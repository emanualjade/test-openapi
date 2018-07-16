'use strict'

const { get, set } = require('lodash/fp')

// Inverse OpenAPI params where `call.*: invalid` was used
const setInvalidParams = function({ params, specialValues: { invalid } }) {
  return invalid.reduce(reduceInvalidParam, params)
}

const reduceInvalidParam = function(params, path) {
  // Retrieve current OpenAPI definition
  const param = get(path, params)

  // Then inverse it
  const paramA = getInvalidParam({ param })

  // And set it back
  return set(path, paramA, params)
}

const getInvalidParam = function({ param }) {
  // If cannot find OpenAPI definition, set as an `anything` schema
  if (param === undefined) {
    return {}
  }

  const type = addNullType({ param })

  // TODO: json-schema-faker support for the `not` keyword is lacking
  // E.g. `type` array is not supported, so `invalid value` actually does not work
  // at the moment.
  return { not: { ...param, type } }
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
  setInvalidParams,
}
