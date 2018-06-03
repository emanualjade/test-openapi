'use strict'

const { callReporters } = require('./call')

// Reporting for each task
const complete = async function(input) {
  const { config } = input
  await callReporters({ config, input, type: 'complete' })
}

module.exports = {
  complete,
}
