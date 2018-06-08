'use strict'

const { isMatch } = require('micromatch')

// `config.skip: 'glob' or ['glob', ...]` sets `task.skip: true`
const setSkippedTasks = function({ skip, tasks, report, pluginNames }) {
  if (skip === undefined) {
    return
  }

  const tasksA = tasks.map(task => setSkippedTask({ skip, task }))

  const reportA = setDryRun({ skip, report, pluginNames })

  return { tasks: tasksA, ...reportA }
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

// When using `config.skip: '*'`, it behaves like a dry run, i.e. no reporting
const setDryRun = function({ skip, report, pluginNames }) {
  // Optional dependency
  if (!pluginNames.includes('report')) {
    return
  }

  if (!isDryRun({ skip })) {
    return
  }

  return { report: { ...report, output: false } }
}

const isDryRun = function({ skip }) {
  return skip === '*' || (Array.isArray(skip) && skip.includes('*'))
}

module.exports = {
  setSkippedTasks,
}
