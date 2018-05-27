'use strict'

const { getFetchParams } = require('./params')
const { fireFetch } = require('./fetch')
const { getFetchResponse } = require('./response')

// Actual HTTP request
const sendRequest = async function({ rawRequest, config }) {
  const { url, fetchParams } = getFetchParams({ rawRequest, config })

  const rawResponse = await fireFetch({ url, fetchParams, config })

  const rawResponseA = await getFetchResponse({ rawResponse, config })

  return { rawResponse: rawResponseA }
}

module.exports = {
  sendRequest,
}
