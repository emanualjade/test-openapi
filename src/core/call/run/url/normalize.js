import { URL } from 'url'

import { TestOpenApiError } from '../../../../errors/error.js'
import { addErrorHandler } from '../../../../errors/handler.js'

// Escape, normalize and validate the request URL
export const normalizeUrl = function({ url: originalUrl }) {
  const url = escapeUrl(originalUrl)
  const urlA = eParseUrl({ url, originalUrl })
  return urlA
}

// According to RFC 3986, all characters should be escaped in paths except:
//   [:alnum:]-.+_~!$&'()*,;=:@/
// However `encodeURI()` does not escape # and ? so we escape them
// This is the same situation for origins, except RFC 3986 forbids slashes, but
// we allow it since `task.call.server` can contain the base path.
const escapeUrl = function(url) {
  return encodeURI(url)
    .replace(/#/gu, '%23')
    .replace(/\?/gu, '%3F')
}

const parseUrl = function({ url }) {
  return new URL(url).toString()
}

const parseUrlHandler = function({ message }, { originalUrl }) {
  throw new TestOpenApiError(
    `Request URL '${originalUrl}' is not a valid full URL: ${message}`,
    // It could come from either `server` or `path`
    { property: 'task.call', value: originalUrl },
  )
}

const eParseUrl = addErrorHandler(parseUrl, parseUrlHandler)
