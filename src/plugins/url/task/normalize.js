'use strict'

const { URL } = require('url')

const { throwError, addErrorHandler } = require('../../../errors')

// Escape, normalize and validate the request URL
const normalizeUrl = function({ url }) {
  const urlA = escapeUrl({ url })
  const urlB = new URL(urlA)
  const urlC = urlB.toString()
  return urlC
}

// According to RFC 3986, all characters should be escaped in paths except:
//   [:alnum:]-.+_~!$&'()*,;=:@/
// However `encodeURI()` does not escape # and ? so we escape them
// This is the same situation for origins, except RFC 3986 forbids slashes, but
// we allow it since `task.parameters.server` can contain the base path.
const escapeUrl = function({ url }) {
  return encodeURI(url)
    .replace(/#/g, '%23')
    .replace(/\?/g, '%3F')
}

const normalizeUrlHandler = function({ message }, { url }) {
  throwError(`Request URL '${url}' is not valid: ${message}`, {
    // It could come from either `server` or `path`
    property: 'parameters',
    actual: url,
  })
}

const eNormalizeUrl = addErrorHandler(normalizeUrl, normalizeUrlHandler)

module.exports = {
  normalizeUrl: eNormalizeUrl,
}
