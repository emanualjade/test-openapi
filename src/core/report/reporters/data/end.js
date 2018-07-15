'use strict'

const { convertPlainObject } = require('../../../../errors')
const { getSummary } = require('../../utils')
const { isSilentTask } = require('../../level')

// JSON reporter
const end = function({ options, options: { spinner }, tasks }) {
  spinner.stop()

  const tasksA = getTasks({ tasks, options })
  const tasksB = JSON.stringify(tasksA, null, 2)
  return `${tasksB}\n`
}

const getTasks = function({ tasks, options }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.filter(task => !isSilentTask({ task, options })).map(getTask)

  return { summary, tasks: tasksA }
}

const getTask = function(task) {
  const error = getError(task)
  return { ...task, error }
}

const getError = function({ error }) {
  if (error === undefined) {
    return
  }

  return convertPlainObject(error)
}

module.exports = {
  end,
}
