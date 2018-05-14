'use strict'

const { generateRequest } = require('./generate')
const { doFetch } = require('./fetch')
const { getDepReturn } = require('./dep_return')

// Perform the main HTTP request of the test
const sendRequest = async function({ method, path, request, opts }) {
  const requestA = generateRequest({ request })

  const { fetchRequest, fetchResponse } = await doFetch({ method, path, request: requestA, opts })

  const requestB = getDepReturn({ request: requestA })

  return { fetchRequest, fetchResponse, request: requestB }
}

module.exports = {
  sendRequest,
}
