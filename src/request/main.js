'use strict'

const { addGenErrorHandler } = require('../errors')

const { generateRequest } = require('./generate')
const { doFetch } = require('./fetch')
const { getDepReturn } = require('./dep_return')

// Perform the main HTTP request of the test
const sendRequest = async function({ method, path, request, opts }) {
  const requestA = generateRequest({ request })

  const depReturn = getDepReturn({ request: requestA })

  const { fetchRequest, fetchResponse } = await eDoFetch({
    method,
    path,
    request: requestA,
    opts,
    depReturn,
  })

  return { fetchRequest, fetchResponse, request: depReturn }
}

const eDoFetch = addGenErrorHandler(doFetch, ({ depReturn }) => ({ request: depReturn }))

module.exports = {
  sendRequest,
}
