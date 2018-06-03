'use strict'

// Repeat each task `config.repeat` times
// If used with `generate` plugin, each time will use different random parameters
// It will be reported only as a single task.
// Run all tasks in parallel.
// If a single one fails, whole `it()` will stop and report that one failure.
const repeatTasks = function({ repeat, runTask }) {
  const runTaskA = repeatTask.bind(null, { repeat, runTask })
  return { runTask: runTaskA }
}

const repeatTask = function({ repeat, runTask }, task, opts, ...args) {
  if (opts.isNested) {
    return runTask(task, opts, ...args)
  }

  const repeatedTasks = new Array(repeat).fill().map(() => runTask(task, opts, ...args))
  return Promise.all(repeatedTasks)
}

module.exports = {
  repeatTasks,
}
