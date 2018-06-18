'use strict'

const { fireRequest } = require('./fetch')
const { getRawResponse } = require('./response')

// Fire actual HTTP call
const request = async function(
  { call, call: { rawRequest } },
  { config: { call: { timeout = DEFAULT_TIMEOUT } = {} } },
) {
  const rawResponse = await fireRequest({ rawRequest, timeout })

  const rawResponseA = await getRawResponse({ rawResponse, timeout })

  return { call: { ...call, rawResponse: rawResponseA } }
}

const DEFAULT_TIMEOUT = 1e4

module.exports = {
  request,
}
