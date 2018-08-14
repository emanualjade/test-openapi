'use strict'

const { getSummary } = require('../../utils')
const { isSilentTask } = require('../../level')

// JSON reporter
const end = function(tasks, { options, options: { spinner } }) {
  spinner.stop()

  const tasksA = getTasks({ tasks, options })
  const tasksB = JSON.stringify(tasksA, null, 2)
  return `${tasksB}\n`
}

const getTasks = function({ tasks, options }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.filter(task => !isSilentTask({ task, options }))

  return { summary, tasks: tasksA }
}

module.exports = {
  end,
}
