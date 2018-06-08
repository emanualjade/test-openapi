'use strict'

const { isMatch } = require('micromatch')

// `config.skip: 'glob' or ['glob', ...]` sets `task.skip: true`
const setSkippedTasks = function({ skip, tasks }) {
  if (skip === undefined) {
    return
  }

  const tasksA = tasks.map(task => setSkippedTask({ skip, task }))
  return { tasks: tasksA }
}

// Also make sure task return value always include `task.skip: boolean`
const setSkippedTask = function({ skip, task }) {
  const skipA = isSkippedTask({ skip, task })
  // This implies `config.skip` has priority over `task.skip`.
  // This matches the behavior of the `only` plugin.
  return { ...task, skip: skipA }
}

const isSkippedTask = function({ skip, task: { key } }) {
  return isMatch(key, skip)
}

module.exports = {
  setSkippedTasks,
}
