'use strict'

const { generateRequest } = require('./generate')
const { getRequestUrl } = require('./url')
const { getRequestHeaders } = require('./headers')
const { getRequestBody } = require('./body')
const { doFetch } = require('./fetch')
const { handleResponse } = require('./response')

// Perform the main HTTP request of the test
const sendRequest = async function({ test, opts }) {
  const fetchOpts = getFetchOpts({ test, opts })

  const res = await doFetch({ ...fetchOpts, opts })

  const resA = await handleResponse({ res })

  return { fetchOpts, res: resA }
}

// Retrieve HTTP request's URL, headers and body
const getFetchOpts = function({
  test,
  test: {
    operation: { method },
    requests,
  },
  opts,
}) {
  const requestA = generateRequest({ requests })

  const url = getRequestUrl({ test, opts, request: requestA })
  const headers = getRequestHeaders({ request: requestA })
  const body = getRequestBody({ request: requestA })

  return { url, method, headers, body }
}

module.exports = {
  sendRequest,
}
