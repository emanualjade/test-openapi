'use strict'

const fetch = require('cross-fetch')

const { addErrorHandler } = require('../../../errors')

const { getFetchParams } = require('./params')
const { getFetchResponse } = require('./response')
const { sendRequestHandler } = require('./errors')

// Actual HTTP request
const sendRequest = async function({ config, config: { dry }, rawRequest }) {
  if (dry) {
    return
  }

  const { url, fetchParams } = getFetchParams({ rawRequest, config })

  const rawResponse = await fetch(url, fetchParams)

  const rawResponseA = await getFetchResponse({ rawResponse })

  return { rawResponse: rawResponseA }
}

const eSendRequest = addErrorHandler(sendRequest, sendRequestHandler)

module.exports = {
  sendRequest: eSendRequest,
}
