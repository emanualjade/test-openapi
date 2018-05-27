'use strict'

// Repeat each task `config.repeat` times, each time with different random parameters
// It will be reported only as a single task
// Run all tasks in parallel
// If a single one fails, whole `it()` will stop and report that one failure
const repeatTasks = function({ repeat, runTask }) {
  const runTaskA = repeatTask.bind(null, { repeat, runTask })
  return { runTask: runTaskA }
}

const repeatTask = async function({ repeat, runTask }, ...args) {
  const repeatedTasks = new Array(repeat).fill().map(() => runTask(...args))
  await Promise.all(repeatedTasks)
}

module.exports = {
  repeatTasks,
}
