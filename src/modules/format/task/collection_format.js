'use strict'

const { stringifyFlat } = require('./json')

// Stringify an array according to OpenAPI's `collectionFormat`
const stringifyCollFormat = function({ value, collectionFormat = 'csv', name }) {
  return COLLECTION_FORMAT[collectionFormat]({ value, name })
}

const stringifyGeneric = function(separator, { value }) {
  return value.map(stringifyFlat).join(separator)
}

const stringifyMulti = function({ value, name }) {
  return value.map(val => stringifyPair({ val, name })).join('&')
}

const stringifyPair = function({ val, name }) {
  return `${name}=${stringifyFlat(val)}`
}

const COLLECTION_FORMAT = {
  csv: stringifyGeneric.bind(null, ','),
  ssv: stringifyGeneric.bind(null, /\s+/),
  tsv: stringifyGeneric.bind(null, '\t'),
  pipes: stringifyGeneric.bind(null, '|'),
  // No parser because it can only be used in request parameters not response headers
  multi: stringifyMulti,
}

module.exports = {
  stringifyCollFormat,
}
