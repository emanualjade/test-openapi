'use strict'

const { fireFetch } = require('./fetch')
const { getFetchResponse } = require('./response')

// Fire actual HTTP call
const task = async function({
  call,
  call: {
    request: { raw: rawRequest },
  },
  config,
}) {
  const rawResponse = await fireFetch({ rawRequest, config })

  const rawResponseA = await getFetchResponse({ rawResponse, config })

  return { call: { ...call, response: { raw: rawResponseA } } }
}

module.exports = {
  task,
}
