'use strict'

const { callReporters } = require('./call')

// Ends reporting
const end = async function({
  tasks,
  config,
  config: {
    report: { level },
  },
}) {
  if (level === 'silent') {
    return
  }

  await callReporters({ config, type: 'end' }, { tasks })
}

module.exports = {
  end,
}
