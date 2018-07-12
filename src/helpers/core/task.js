'use strict'

const { get } = require('../../utils')
const { TestOpenApiError } = require('../../errors')

// `{ $$task: 'TASK PATH [OPT,...]' }` helper
// Runs TASK and replace helper with `task[PATH]`
const taskHelper = async function({ config: { tasks }, _runTask: runTask }, taskArg) {
  const { taskKey, path, options } = parseTaskArg({ taskArg })

  const task = findTask({ taskKey, tasks })

  const getError = getTaskError.bind(null, { task })
  const taskA = await runTask({ task, getError })

  const taskProp = await getTaskProp({ task: taskA, path, options })
  return taskProp
}

taskHelper.context = true

// Parse 'TASK PATH [OPTS,...]'
const parseTaskArg = function({ taskArg }) {
  const [taskKey, path, options = ''] = taskArg.split(/\s+/)

  if (!taskKey || !path) {
    throw new TestOpenApiError('argument must be a task name followed by a property path')
  }

  const optionsA = options.split(',').filter(option => option !== '')

  return { taskKey, path, options: optionsA }
}

// Find the task definition
const findTask = function({ taskKey, tasks }) {
  const task = tasks.find(({ key }) => key === taskKey)

  if (task === undefined) {
    throw new TestOpenApiError(`task '${taskKey}' does not exist`)
  }

  return task
}

const getTaskError = function({ task: { key } }) {
  return new TestOpenApiError(`task '${key}' failed`)
}

// Retrieve task property
const getTaskProp = function({ task, task: { key }, path, options }) {
  const taskProp = get(task, path)

  if (taskProp === undefined && !options.includes('optional')) {
    throw new TestOpenApiError(`task '${key}' did not return any property '${path}'`)
  }

  return taskProp
}

module.exports = {
  $$task: taskHelper,
}
