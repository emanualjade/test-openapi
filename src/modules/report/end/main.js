'use strict'

const { callReporter } = require('../call')

// Ends reporting
const end = async function(input) {
  const { config } = input
  await callReporter({ config, input, type: 'end' })
}

module.exports = {
  end,
}
