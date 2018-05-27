'use strict'

const { fireFetch } = require('./fetch')
const { getFetchResponse } = require('./response')

// Fire actual HTTP request
const sendRequest = async function({ rawRequest, config }) {
  const rawResponse = await fireFetch({ rawRequest, config })

  const rawResponseA = await getFetchResponse({ rawResponse, config })

  return { rawResponse: rawResponseA }
}

module.exports = {
  sendRequest,
}
