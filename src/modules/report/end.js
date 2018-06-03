'use strict'

const { callReporters } = require('./call')

// Ends reporting
const end = async function(input) {
  const { config } = input
  await callReporters({ config, input, type: 'end' })
}

module.exports = {
  end,
}
