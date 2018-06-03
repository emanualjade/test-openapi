'use strict'

// Repeat each task `config.repeat` times
// If used with `random` plugin, each time will use different random parameters
// It will be reported only as a single task.
// Run all tasks in parallel.
const repeatTasks = function({ repeat, runTask }) {
  const runTaskA = repeatTask.bind(null, { repeat, runTask })
  return { runTask: runTaskA }
}

const repeatTask = async function({ repeat, runTask }, task, opts, ...args) {
  if (opts.isNested) {
    return runTask(task, opts, ...args)
  }

  // Default `task.repeat` to `config.repeat`
  const repeatA = task.repeat || repeat

  const returns = await runTasks({ repeat: repeatA, task, opts, args, runTask })

  const taskReturn = getTaskReturn({ returns })
  return taskReturn
}

// Since `runTask()` has an exception handler, no promise should be rejected.
// I.e. if one task fails, the others are still run.
// The reason is to allow reporting when some tasks failed but not others.
const runTasks = async function({ repeat, task, opts, args, runTask }) {
  // Add `task.repeat`
  const taskA = { ...task, repeat }

  const returns = new Array(repeat).fill().map(() => runTask(taskA, opts, ...args))
  const returnsA = await Promise.all(returns)
  return returnsA
}

const getTaskReturn = function({ returns }) {
  const tasks = pluck(returns, 'task')
  const errors = pluck(returns, 'error')
  const singleReturn = getSingleReturn({ tasks, errors })

  return { tasks, errors, ...singleReturn }
}

const pluck = function(returns, prop) {
  return returns.map(obj => obj[prop]).filter(value => value !== undefined)
}

// Normal `{ task }` or `{ error }` return value is still present
// Pick the first failed|successful one
const getSingleReturn = function({ tasks, errors }) {
  if (errors.length !== 0) {
    return { error: errors[0] }
  }

  return { task: tasks[0] }
}

module.exports = {
  repeatTasks,
}
