import { TestOpenApiError } from '../../../../errors/error.js'

// Parse a HTTP response
export const getRawResponse = async function({
  rawResponse,
  rawResponse: { status },
  rawRequest,
}) {
  const headers = getHeaders({ rawResponse })

  try {
    // We get the raw body. It will be parsed according to the `Content-Type`
    // later
    const body = await rawResponse.text()
    return { status, ...headers, body }
  } catch (error) {
    getBodyHandler(error, { rawRequest })
  }
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
