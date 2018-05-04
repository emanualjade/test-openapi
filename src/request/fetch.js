'use strict'

const fetch = require('cross-fetch')

// Actual HTTP request
const doFetch = async function({ url, method, headers, body, opts: { timeout } }) {
  try {
    return await fetch(url, { timeout, method, headers, body })
  } catch (error) {
    throw new Error(`Could not connect to ${url}: ${error.message}`)
  }
}

module.exports = {
  doFetch,
}
