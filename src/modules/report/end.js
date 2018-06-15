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
  if (level.types.length === 0) {
    return
  }

  await callReporters({ config, type: 'end' }, { tasks, config })
}

module.exports = {
  end,
}
