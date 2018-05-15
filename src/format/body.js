'use strict'

const { is: isMime } = require('type-is')

const { addErrorHandler, throwResponseError } = require('../errors')

// Retrieve a parser and stringifier for a specific MIME type
// TODO: replace by real body parsing library and add support for other content types
const findBodyHandler = function({ mime }) {
  return BODY_HANDLERS.find(({ condition }) => condition({ mime })) || {}
}

const normalizeHandler = function({ name, condition, parse, stringify }) {
  const parseA = addErrorHandler(parse, parseHandler.bind(null, name))
  return { condition, parse: parseA, stringify }
}

const parseHandler = function(name, { message }, body) {
  const property = 'response.body'
  throwResponseError(`Could not read response body as ${name}: ${message}\n${body}`, { property })
}

const isJson = function({ mime }) {
  return isMime(mime, JSON_MIMES) !== false
}

const JSON_MIMES = ['application/json', '+json']

const BODY_HANDLERS = [
  {
    name: 'JSON',
    condition: isJson,
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
].map(normalizeHandler)

module.exports = {
  findBodyHandler,
}
