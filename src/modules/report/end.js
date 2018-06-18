'use strict'

const { isSilent, filterTaskData } = require('./level')
const { callReporters } = require('./call')

// Ends reporting
const end = async function(tasks, { config }, { plugins }) {
  if (isSilent({ config })) {
    return
  }

  const tasksA = tasks.map(task => filterTaskData({ task, config, plugins }))

  await callReporters({ config, type: 'end' }, { tasks: tasksA, config })
}

module.exports = {
  end,
}
