'use strict'

const { addGenErrorHandler } = require('../errors')

const { doFetch } = require('./fetch')
const { getNormRequest } = require('./norm_request')

// Perform the main HTTP request of the test
const sendRequest = async function({ method, path, request, opts }) {
  const normRequest = getNormRequest({ request })

  const { fetchRequest, fetchResponse } = await eDoFetch({
    method,
    path,
    request,
    opts,
    normRequest,
  })

  return { fetchRequest, fetchResponse, normRequest }
}

const eDoFetch = addGenErrorHandler(doFetch, ({ normRequest }) => ({ request: normRequest }))

module.exports = {
  sendRequest,
}
