'use strict'

const { fireFetch } = require('./fetch')
const { getFetchResponse } = require('./response')

// Fire actual HTTP call
const fireHttpCall = async function({
  call,
  call: {
    request: { raw: rawRequest },
  },
  config,
  titles,
}) {
  const rawResponse = await fireFetch({ rawRequest, config })

  const rawResponseA = await getFetchResponse({ rawResponse, config })

  const titlesA = addTitle({ titles, rawResponse: rawResponseA })

  return { call: { ...call, response: { raw: rawResponseA } }, titles: titlesA }
}

// Add HTTP status code to reporting
const addTitle = function({ titles, rawResponse: { status } }) {
  const title = `(${String(status)})`
  return [...titles, title]
}

module.exports = {
  fireHttpCall,
}
