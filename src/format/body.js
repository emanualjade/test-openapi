'use strict'

const { is: isMime } = require('type-is')

// Retrieve a parser and stringifier for a specific MIME type
// TODO: replace by real body parsing library and add support for other content types
const findBodyHandler = function({ mime }) {
  return BODY_HANDLERS.find(({ condition }) => condition({ mime })) || {}
}

const isJson = function({ mime }) {
  return isMime(mime, JSON_MIMES) !== false
}

const JSON_MIMES = ['application/json', '+json']

const BODY_HANDLERS = [
  {
    condition: isJson,
    parse: JSON.parse,
    stringify: JSON.stringify,
    name: 'JSON',
  },
]

module.exports = {
  findBodyHandler,
}
