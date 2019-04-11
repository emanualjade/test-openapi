import { Buffer } from 'buffer'

import { mapKeys } from 'lodash'

const { byteLength } = Buffer

// The `node-fetch` library adds few HTTP request headers, so we add them
// to `rawRequest`
// Unfortunately the library does not allow accessing them, so we need to repeat
// its logic here and recalculate them.
export const addFetchRequestHeaders = function({ call }) {
  const headers = getFetchRequestHeaders({ call })
  const headersA = mapKeys(headers, (value, name) => `headers.${name}`)
  return { ...call, ...headersA }
}

const getFetchRequestHeaders = function({
  call: {
    'headers.accept': accept = DEFAULT_ACCEPT,
    'headers.accept-encoding': acceptEncoding = DEFAULT_ACCEPT_ENCODING,
    'headers.connection': connection = DEFAULT_CONNECTION,
  },
}) {
  return { accept, 'accept-encoding': acceptEncoding, connection }
}

const DEFAULT_ACCEPT = '*/*'
const DEFAULT_ACCEPT_ENCODING = 'gzip,deflate'
const DEFAULT_CONNECTION = 'close'

// Same for `Content-Length` (must be done after body has been serialized)
export const addContentLength = function({ request, rawRequest }) {
  const contentLength = getContentLength({ rawRequest })

  if (contentLength === undefined) {
    return { request, rawRequest }
  }

  const requestA = { ...request, 'headers.content-length': contentLength }
  const rawRequestA = {
    ...rawRequest,
    'headers.content-length': String(contentLength),
  }
  return { request: requestA, rawRequest: rawRequestA }
}

const getContentLength = function({ rawRequest: { method, body } }) {
  if (body != null) {
    return byteLength(body)
  }

  if (!['put', 'post'].includes(method)) {
    return
  }

  return 0
}
