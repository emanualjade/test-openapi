const { mapValues, omitBy } = require('lodash')

const { get, tryGet } = require('../../utils')
const { TestOpenApiError } = require('../../errors')

// `task.variables.$$NAME: '[PATH] [OPTS]'` allows using `$$NAME` in any task,
// to run the task that defined the variables, and retrieve a specific property
// at `PATH`
const template = function({ _allTasks: allTasks, _runTask: runTask }) {
  const variables = allTasks.map(taskA =>
    getTaskVariables({ task: taskA, allTasks, runTask }),
  )
  const variablesA = Object.assign({}, ...variables)
  return variablesA
}

const getTaskVariables = function({
  task: { key, variables },
  allTasks,
  runTask,
}) {
  if (variables === undefined) {
    return
  }

  const variablesA = omitBy(variables, value => value === undefined)

  const taskVariables = mapValues(variablesA, value =>
    evalTask.bind(null, { key, value, allTasks, runTask }),
  )
  return taskVariables
}

// Runs a task and returns `task[PATH]`
const evalTask = async function({ key, value, allTasks, runTask }) {
  const taskA = await runVariableTask({ key, allTasks, runTask })

  const taskProp = getTaskProp({ task: taskA, value })
  return taskProp
}

// Runs the task
const runVariableTask = async function({ key, allTasks, runTask }) {
  const taskA = allTasks.find(task => task.key === key)

  const getError = getTaskError.bind(null, { task: taskA })
  const taskB = await runTask({ task: taskA, getError })
  return taskB
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

  if (taskProp !== undefined || options.includes('optional')) {
    return taskProp
  }

  const { wrongPath, value: valueA } = tryGet(task, path)
  throw new TestOpenApiError(
    `task '${key}' did not return any property '${wrongPath}'`,
    { value: valueA },
  )
}

// Parse '[PATH] [OPTS,...]'
const parseValue = function({ value }) {
  const [path, options = ''] = value.split(/\s+/u)
  const optionsA = options.split(',').filter(option => option !== '')

  return { path, options: optionsA }
}

module.exports = {
  template,
}
