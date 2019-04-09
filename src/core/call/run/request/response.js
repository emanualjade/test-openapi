import { addErrorHandler, TestOpenApiError } from '../../../../errors.js'

// Parse a HTTP response
export const getRawResponse = async function({
  rawResponse,
  rawResponse: { status },
  rawRequest,
}) {
  const headers = getHeaders({ rawResponse })
  const body = await eGetBody({ rawResponse, rawRequest })

  return { status, ...headers, body }
}

// Normalize response headers to a plain object
// Response headers name are normalized to lowercase:
//  - it makes matching them easier, both for other plugins and for the
// return value.
//  - this implies original case is lost
//  - it is automatically done by both the Fetch standard and Node.js
//    core `http` module
const getHeaders = function({ rawResponse: { headers } }) {
  const headersA = [...headers.entries()]
  const headersB = headersA.map(([name, value]) => ({
    [`headers.${name}`]: value,
  }))
  const headersC = Object.assign({}, ...headersB)
  return headersC
}

// We get the raw body. It will be parsed according to the `Content-Type` later
const getBody = function({ rawResponse }) {
  return rawResponse.text()
}

const getBodyHandler = function(
  { message, type },
  { rawRequest: { timeout } },
) {
  const property = 'task.call.response.body'

  if (type === 'body-timeout') {
    throw new TestOpenApiError(
      `Parsing the response body took more than ${timeout} milliseconds`,
      { property },
    )
  }

  throw new TestOpenApiError(`Could not read response body: ${message}`, {
    property,
  })
}

const eGetBody = addErrorHandler(getBody, getBodyHandler)
