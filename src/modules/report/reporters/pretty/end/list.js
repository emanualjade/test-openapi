'use strict'

const { getResultType, gray, indent } = require('../../../utils')
const { isSilentType } = require('../../../level')
const { LINE, COLORS, MARKS } = require('../constants')

// Print a summary of each task: skipped tasks names, then passed tasks names,
// then failed tasks names + error messages
const printTasksList = function({ tasks, startData }) {
  const tasksList = RESULT_TYPES
    // Filter according to `report.level`
    .filter(resultType => !isSilentType({ resultType, startData }))
    .map(resultType => printTasks({ tasks, resultType }))
    // Do not show newlines if no tasks is to be shown
    .filter(tasksListPart => tasksListPart !== '')
    .join('\n\n')

  // Do not show horizontal line and newlines if nothing is to be shown
  if (tasksList === '') {
    return ''
  }

  return `${indent(tasksList)}\n${LINE}\n`
}

// Order matters
const RESULT_TYPES = ['skip', 'pass', 'fail']

const printTasks = function({ tasks, resultType }) {
  const padLength = getPadLength({ tasks })

  return tasks
    .filter(task => getResultType(task) === resultType)
    .map(task => printTask({ task, resultType, padLength }))
    .join('\n')
}

// Vertically align all `task.path`
const getPadLength = function({ tasks }) {
  const lengths = tasks.map(({ key }) => key.length)
  const maxLength = Math.max(...lengths)
  return maxLength + 2
}

const printTask = function({ task, task: { key, path }, resultType, padLength }) {
  const name = getTaskName({ key, path, padLength })
  const taskA = TASK_PRINTERS[resultType]({ task, name })

  const taskB = `${MARKS[resultType]}  ${taskA}`
  const taskC = COLORS[resultType](taskB)
  return taskC
}

const getTaskName = function({ key, path = '', padLength }) {
  return `${key.padEnd(padLength)}${path}`
}

const printTaskSkip = function({ name }) {
  return name
}

const printTaskPass = function({ name }) {
  return name
}

const printTaskFail = function({
  name,
  task: {
    error: { message },
  },
}) {
  return `${name}\n   ${gray(message)}`
}

const TASK_PRINTERS = {
  skip: printTaskSkip,
  pass: printTaskPass,
  fail: printTaskFail,
}

module.exports = {
  printTasksList,
}
