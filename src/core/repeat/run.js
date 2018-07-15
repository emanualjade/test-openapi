'use strict'

// Repeat each task `config|task.repeat` times.
// It will be reported only as a single task.
// Run all tasks in parallel.
const run = async function(task, { _nestedPath: nestedPath, _runTask: runTask }) {
  if (nestedPath !== undefined) {
    return
  }

  const { repeat = DEFAULT_REPEAT } = task

  const tasks = new Array(repeat).fill().map(() => runTask({ task, self: true }))
  // We only keep the first task. If any fails, the first error will be propagated.
  const [taskA] = await Promise.all(tasks)

  // We interrupt next handlers since we already ran them
  return { ...taskA, done: true }
}

const DEFAULT_REPEAT = 10

module.exports = {
  run,
}
