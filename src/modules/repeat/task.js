'use strict'

// Repeat each task `config|task.repeat` times.
// It will be reported only as a single task.
// Run all tasks in parallel.
const task = async function(task, { config }, { isNested, runTask }) {
  if (isNested) {
    return
  }

  const repeat = getRepeat({ task, config })

  const tasks = new Array(repeat).fill().map(() => runTask(task))
  // We only keep the first task. If any fails, the first error will be propagated.
  const [taskA] = await Promise.all(tasks)

  // We interrupt next handlers since we already ran them
  return { ...taskA, done: true }
}

const getRepeat = function({ task, config }) {
  return task.repeat || config.repeat || DEFAULT_REPEAT
}

const DEFAULT_REPEAT = 10

module.exports = {
  task,
}
