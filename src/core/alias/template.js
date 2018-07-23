'use strict'

const { mapValues } = require('lodash')

const { get } = require('../../utils')
const { TestOpenApiError } = require('../../errors')

// `task.alias.$$NAME: '[PATH] [OPTS]'` allows using `$$NAME` in any task, to
// run the task that defined the alias, and retrieve a specific property at `PATH`
const template = function(task, { config: { _allTasks: allTasks }, _runTask: runTask }) {
  const aliases = allTasks.map(taskA => getTaskAliases({ task: taskA, allTasks, runTask }))
  const aliasesA = Object.assign({}, ...aliases)
  return aliasesA
}

const getTaskAliases = function({ task: { key, alias }, allTasks, runTask }) {
  if (alias === undefined) {
    return
  }

  const taskAliases = mapValues(alias, value =>
    evalTask.bind(null, { key, value, allTasks, runTask }),
  )
  return taskAliases
}

// Runs a task and returns `task[PATH]`
const evalTask = async function({ key, value, allTasks, runTask }) {
  const taskA = await runAliasTask({ key, allTasks, runTask })

  const taskProp = getTaskProp({ task: taskA, value })
  return taskProp
}

// Runs the task
const runAliasTask = async function({ key, allTasks, runTask }) {
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
  template,
}
