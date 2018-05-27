'use strict'

const { stringifyFlat, parseFlat } = require('../../utils')

// Whether a specific value should be parsed according to `collectionFormat`
// using information from its OpenAPI schema
const usesCollFormat = function({ value, schema }) {
  return (
    hasType({ schema, type: 'array' }) &&
    typeof value === 'string' &&
    (!value.startsWith('[') || !value.endsWith(']'))
  )
}

const hasType = function({ schema, type }) {
  // JSON schema `type` can be an array
  if (Array.isArray(schema.type)) {
    return schema.type.includes(type)
  }

  return schema.type === type
}

// Parses an array according to OpenAPI's `collectionFormat`
const parseCollFormat = function({ value, collectionFormat = 'csv' }) {
  const { parse } = COLLECTION_FORMAT[collectionFormat]
  return parse(value)
}

const parseGeneric = function(separator, value) {
  return value.split(separator).map(parseFlat)
}

// Stringify an array according to OpenAPI's `collectionFormat`
const stringifyCollFormat = function({ value, collectionFormat = 'csv', name }) {
  const { stringify } = COLLECTION_FORMAT[collectionFormat]
  return stringify({ value, name })
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
  csv: {
    parse: parseGeneric.bind(null, ','),
    stringify: stringifyGeneric.bind(null, ','),
  },
  ssv: {
    parse: parseGeneric.bind(null, /\s+/),
    stringify: stringifyGeneric.bind(null, /\s+/),
  },
  tsv: {
    parse: parseGeneric.bind(null, '\t'),
    stringify: stringifyGeneric.bind(null, '\t'),
  },
  pipes: {
    parse: parseGeneric.bind(null, '|'),
    stringify: stringifyGeneric.bind(null, '|'),
  },
  // No parser because it can only be used in request parameters not response headers
  multi: {
    stringify: stringifyMulti,
  },
}

module.exports = {
  usesCollFormat,
  parseCollFormat,
  stringifyCollFormat,
}
