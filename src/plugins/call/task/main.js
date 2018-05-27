'use strict'

const { fireFetch } = require('./fetch')
const { getFetchResponse } = require('./response')

// Fire actual HTTP call
const fireHttpCall = async function({ call: { rawRequest }, config }) {
  const rawResponse = await fireFetch({ rawRequest, config })

  const rawResponseA = await getFetchResponse({ rawResponse, config })

  return { rawResponse: rawResponseA }
}

module.exports = {
  fireHttpCall,
}
