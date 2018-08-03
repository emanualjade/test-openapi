'use strict'

const { parse, tokensToFunction } = require('path-to-regexp')

const { removePrefixes, getPath } = require('../../../../utils')
const { addErrorHandler, TestOpenApiError } = require('../../../../errors')

// Replace `url` request parameters to the request URL.
// Can replace in both `task.call.server` and `task.call.path`
// Uses same syntax as Express paths, e.g. `:NAME`, `:NAME*`, `:NAME+` or `(RegExp)`
// The library calls `encodeURIComponent()` on each URL variable
const addUrlParams = function({ url, rawRequest }) {
  const urlParams = removePrefixes(rawRequest, 'url')

  const tokens = parseUrl({ url })

  validateRequiredParams({ tokens, urlParams })

  const urlA = serializeUrl({ tokens, urlParams })
  return urlA
}

// Parse URL `:NAME` variables tokens
const parseUrl = function({ url }) {
  const tokens = parse(url)
  const tokensA = tokens.map(handlePort)
  return tokensA
}

// `path-to-regex` considers `:PORT` to be a URL variable, which is incorrect.
// We fix this by serializing tokens back to a plain string.
const handlePort = function(token) {
  if (typeof token === 'string') {
    return token
  }

  // Not if `:NUMBER*` nor `:NUMBER+`
  const { name, optional, repeat } = token
  const isPort = !optional && !repeat && PORT_REGEXP.test(name)
  if (!isPort) {
    return token
  }

  return `:${name}`
}

const PORT_REGEXP = /^\d+$/

// `path-to-regex` already validates required parameters, but we do first to
// provide a better error message
const validateRequiredParams = function({ tokens, urlParams }) {
  tokens.forEach(token => validateRequiredParam({ token, urlParams }))
}

const validateRequiredParam = function({ token, urlParams }) {
  if (!isRequiredParam(token)) {
    return
  }

  const { name } = token

  if (urlParams[name] !== undefined && urlParams[name] !== '') {
    return
  }

  throwError('must not be empty', { name })
}

const isRequiredParam = function(token) {
  return typeof token !== 'string' && !token.optional
}

// Replace URL `:NAME` tokens by `call.url.*` values
const serializeUrl = function({ tokens, urlParams }) {
  // We run `tokensToFunction` on each `token` instead of once on all of them
  // so the error handler knows which `token` failed without parsing the error message
  return tokens.map(token => eSerializeToken({ token, urlParams })).join('')
}

const serializeToken = function({ token, urlParams }) {
  // This also performs `encodeURIComponent()`
  return tokensToFunction([token])(urlParams)
}

const serializeTokenHandler = function({ message }, { token: { name } }) {
  throwError(`is invalid: ${message}`, { name })
}

const eSerializeToken = addErrorHandler(serializeToken, serializeTokenHandler)

const throwError = function(message, { name }) {
  const property = getPath(['task', 'call', `url.${name}`])
  throw new TestOpenApiError(`The URL parameter '${name}' ${message}`, { property })
}

module.exports = {
  addUrlParams,
}
