'use strict'

const { stringifyFlat, parseFlat } = require('./json')

// Whether a specific value should be parsed according to `collectionFormat`
// using information from its OpenAPI schema
const usesCollectionFormat = function({ value, schema }) {
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
const parseCollectionFormat = function({ value, collectionFormat = 'csv' }) {
  const { parse } = COLLECTION_FORMAT[collectionFormat]
  return parse(value)
}

const parseGenericCollectionFormat = function(separator, value) {
  return value.split(separator).map(parseFlat)
}

// Stringify an array according to OpenAPI's `collectionFormat`
const stringifyCollectionFormat = function({ value, collectionFormat = 'csv', name }) {
  const { stringify } = COLLECTION_FORMAT[collectionFormat]
  return stringify({ value, name })
}

const stringifyGenericCollectionFormat = function(separator, { value }) {
  return value.map(stringifyFlat).join(separator)
}

const stringifyMultiCollectionFormat = function({ value, name }) {
  return value.map(val => stringifyPair({ val, name })).join('&')
}

const stringifyPair = function({ val, name }) {
  return `${name}=${stringifyFlat(val)}`
}

const COLLECTION_FORMAT = {
  csv: {
    parse: parseGenericCollectionFormat.bind(null, ','),
    stringify: stringifyGenericCollectionFormat.bind(null, ','),
  },
  ssv: {
    parse: parseGenericCollectionFormat.bind(null, /\s+/),
    stringify: stringifyGenericCollectionFormat.bind(null, /\s+/),
  },
  tsv: {
    parse: parseGenericCollectionFormat.bind(null, '\t'),
    stringify: stringifyGenericCollectionFormat.bind(null, '\t'),
  },
  pipes: {
    parse: parseGenericCollectionFormat.bind(null, '|'),
    stringify: stringifyGenericCollectionFormat.bind(null, '|'),
  },
  // No parser because it can only be used in request parameters not response headers
  multi: {
    stringify: stringifyMultiCollectionFormat,
  },
}

module.exports = {
  usesCollectionFormat,
  parseCollectionFormat,
  stringifyCollectionFormat,
}
