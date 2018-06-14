'use strict'

const { callReporters } = require('./call')

// Ends reporting
const end = async function(input) {
  const { config } = input
  await callReporters({ config, type: 'end' }, input)
}

module.exports = {
  end,
}
