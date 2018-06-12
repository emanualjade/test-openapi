'use strict'

// Repeat each task `config.repeat` times
// If used with `random` plugin, each time will use different random parameters
// It will be reported only as a single task.
// Run all tasks in parallel.
const start = function({ repeat = DEFAULT_REPEAT, runTask }) {
  const runTaskA = repeatTask.bind(null, { repeat, runTask })
  return { runTask: runTaskA }
}

const DEFAULT_REPEAT = 10

const repeatTask = async function({ repeat, runTask }, task, opts, ...args) {
  if (opts.readOnlyArgs.isNested) {
    return runTask(task, opts, ...args)
  }

  // Default `task.repeat` to `config.repeat`
  const repeatA = task.repeat || repeat

  // Since `runTask()` has an exception handler, no promise should be rejected.
  // I.e. if one task fails, the others are still run.
  // The reason is to allow reporting when some tasks failed but not others.
  const tasks = new Array(repeatA).fill().map(() => runTask(task, opts, ...args))
  const tasksA = await Promise.all(tasks)

  const taskA = getTaskReturn({ tasks: tasksA })
  return taskA
}

// Return first task that errored. If none, returns first task.
const getTaskReturn = function({ tasks }) {
  const erroredTask = tasks.find(({ error }) => error !== undefined)
  if (erroredTask !== undefined) {
    return erroredTask
  }

  return tasks[0]
}

module.exports = {
  start,
}
