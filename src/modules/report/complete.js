'use strict'

const { callReporter } = require('./call')

// Reporting for each task
const complete = async function(input) {
  const { config } = input
  await callReporter({ config, input, type: 'complete' })
}

module.exports = {
  complete,
}
