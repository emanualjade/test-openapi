'use strict'

const { convertPlainObject } = require('../../../../errors')
const { getSummary, getResultType } = require('../../utils')

// JSON reporter
const end = function({
  options: { spinner },
  tasks,
  config: {
    report: {
      level: { types },
    },
  },
}) {
  spinner.stop()

  const tasksA = getTasks({ tasks, types })
  const tasksB = JSON.stringify(tasksA, null, 2)
  return tasksB
}

const getTasks = function({ tasks, types }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.filter(task => filterTask({ task, types })).map(getTask)

  return { summary, tasks: tasksA }
}

// Apply `config.report.level`
const filterTask = function({ task, types }) {
  const resultType = getResultType(task)
  return types.includes(resultType)
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
