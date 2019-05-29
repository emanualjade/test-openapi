import { is as isMime } from 'type-is'

// Retrieve a parser and stringifier for a specific MIME type
// TODO: replace by real body parsing library and add support for other
// content types
export const findBodyHandler = function({ mime }) {
  return BODY_HANDLERS.find(({ condition }) => condition({ mime })) || {}
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
]
