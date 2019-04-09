const { getResultType, gray, indent } = require('../../../utils')
const { isSilentType } = require('../../../level')
const { LINE, COLORS, MARKS } = require('../constants')

// Print a summary of each task: skipped tasks names, then passed tasks names,
// then failed tasks names + error messages
const printTasksList = function({ tasks, options }) {
  const tasksList = RESULT_TYPES
    // Filter according to `config.report.REPORTER.level`
    .filter(resultType => !isSilentType({ resultType, options }))
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
  return tasks
    .filter(task => getResultType(task) === resultType)
    .map(task => printTask({ task, resultType }))
    .join('\n')
}

const printTask = function({ task, task: { key }, resultType }) {
  const taskA = TASK_PRINTERS[resultType]({ task, key })

  const taskB = `${MARKS[resultType]}  ${taskA}`
  const taskC = COLORS[resultType](taskB)
  return taskC
}

const printTaskSkip = function({ key }) {
  return key
}

const printTaskPass = function({ key }) {
  return key
}

const printTaskFail = function({
  key,
  task: {
    error: { message },
  },
}) {
  return `${key}\n${gray(indent(message, 1))}`
}

const TASK_PRINTERS = {
  skip: printTaskSkip,
  pass: printTaskPass,
  fail: printTaskFail,
}

module.exports = {
  printTasksList,
}
