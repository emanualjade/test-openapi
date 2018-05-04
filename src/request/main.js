'use strict'

const { generateParams } = require('./generate')
const { getReqUrl } = require('./url')
const { getReqHeaders } = require('./headers')
const { getReqBody } = require('./body')
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
const getFetchOpts = function({ test, test: { method, specReqParams }, opts }) {
  const params = generateParams({ specReqParams })

  const url = getReqUrl({ test, opts, params })
  const headers = getReqHeaders({ params })
  const body = getReqBody({ params })

  return { url, method, headers, body }
}

module.exports = {
  sendRequest,
}
