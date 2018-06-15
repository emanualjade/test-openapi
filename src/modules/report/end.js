'use strict'

const { omit } = require('lodash')

const { isSilent, filterTaskData } = require('./level')
const { callReporters } = require('./call')

// Ends reporting
const end = async function({ tasks, config, plugins }) {
  if (isSilent({ config })) {
    return
  }

  const tasksA = tasks.map(task => mapTask({ task, config, plugins }))

  await callReporters({ config, type: 'end' }, { tasks: tasksA, config })
}

const mapTask = function({ task, config, plugins }) {
  const taskA = filterTaskData({ task, config, plugins })
  const taskB = omit(taskA, 'originalTask')
  return taskB
}

module.exports = {
  end,
}
