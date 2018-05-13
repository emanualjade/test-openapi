'use strict'

const { generateRequest } = require('./generate')
const { doFetch } = require('./fetch')
const { getDepReturn } = require('./dep_return')

// Perform the main HTTP request of the test
const sendRequest = async function({ method, path, requests, opts }) {
  const request = generateRequest({ requests })

  const { fetchRequest, fetchResponse } = await doFetch({ method, path, request, opts })

  const requestA = getDepReturn({ request })

  return { fetchRequest, fetchResponse, request: requestA }
}

module.exports = {
  sendRequest,
}
