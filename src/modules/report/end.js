'use strict'

const { isSilent, filterTaskData } = require('./level')
const { callReporters } = require('./call')

// Ends reporting
const end = async function(tasks, { startData }, { plugins }) {
  if (isSilent({ startData })) {
    return
  }

  const tasksA = tasks.map(task => filterTaskData({ task, startData, plugins }))

  await callReporters({ startData, type: 'end' }, { tasks: tasksA, startData })
}

module.exports = {
  end,
}
