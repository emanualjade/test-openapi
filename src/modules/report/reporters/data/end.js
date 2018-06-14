'use strict'

const { convertPlainObject } = require('../../../../errors')
const { getSummary } = require('../../utils')

// JSON reporter
const end = function({ options: { spinner }, tasks }) {
  spinner.stop()

  const tasksA = getTasks({ tasks })
  const tasksB = JSON.stringify(tasksA, null, 2)
  return tasksB
}

const getTasks = function({ tasks }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.map(getTask)

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
