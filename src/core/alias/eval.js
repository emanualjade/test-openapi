'use strict'

const { get } = require('../../utils')
const { TestOpenApiError } = require('../../errors')

// Bind `evalTask()` without losing `function.context`
const getEvalTask = function({ key, value }) {
  const evalTaskA = evalTask.bind(null, { key, value })
  evalTaskA.context = true
  return evalTaskA
}

// Runs a task and returns `task[PATH]`
const evalTask = async function({ key, value }, { config, _runTask: runTask }) {
  const taskA = await runAliasTask({ key, config, runTask })

  const taskProp = getTaskProp({ task: taskA, value })
  return taskProp
}

// Runs the task
const runAliasTask = async function({ key, config: { _allTasks: allTasks }, runTask }) {
  const task = allTasks.find(task => task.key === key)

  const getError = getTaskError.bind(null, { task })
  const taskA = await runTask({ task, getError })
  return taskA
}

const getTaskError = function({ task: { key } }) {
  return new TestOpenApiError(`task '${key}' failed`)
}

// Retrieve task property
const getTaskProp = function({ task, task: { key }, value }) {
  const { path, options } = parseValue({ value })

  if (path === undefined) {
    return task
  }

  const taskProp = get(task, path)

  if (taskProp === undefined && !options.includes('optional')) {
    throw new TestOpenApiError(`task '${key}' did not return any property '${path}'`)
  }

  return taskProp
}

// Parse '[PATH] [OPTS,...]'
const parseValue = function({ value }) {
  const [path, options = ''] = value.split(/\s+/)
  const optionsA = options.split(',').filter(option => option !== '')

  return { path, options: optionsA }
}

module.exports = {
  getEvalTask,
}
