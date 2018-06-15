'use strict'

const { callReporters } = require('./call')

// Ends reporting
const end = async function({ tasks, config }) {
  await callReporters({ config, type: 'end' }, { tasks })
}

module.exports = {
  end,
}
