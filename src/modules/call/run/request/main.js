'use strict'

const { fireRequest } = require('./fetch')
const { getRawResponse } = require('./response')

// Fire actual HTTP call
const request = async function({ call, call: { rawRequest } = {} }) {
  if (call === undefined) {
    return
  }

  const rawResponse = await fireRequest({ rawRequest })

  const rawResponseA = await getRawResponse({ rawResponse, rawRequest })

  return { call: { ...call, rawResponse: rawResponseA } }
}

module.exports = {
  request,
}
