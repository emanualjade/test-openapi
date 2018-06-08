'use strict'

const { isMatch } = require('micromatch')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: true` will only run those tasks
// Tasks are filtered in beginning of `start` handlers, i.e. excluded tasks
// will not be reported.
const selectOnlyTasks = function({ only, tasks }) {
  const onlyTasks = getOnlyTasks({ only, tasks })
  if (onlyTasks.length === 0) {
    return
  }

  return { tasks: onlyTasks }
}

const getOnlyTasks = function({ only, tasks }) {
  const eachOnlyTasks = getEachOnlyTasks({ tasks })

  // `task.only` has priority over `config.only`
  if (eachOnlyTasks.length !== 0) {
    return eachOnlyTasks
  }

  const topOnlyTasks = getTopOnlyTasks({ only, tasks })
  return topOnlyTasks
}

const getEachOnlyTasks = function({ tasks }) {
  return tasks.filter(({ only }) => only === true)
}

const getTopOnlyTasks = function({ only, tasks }) {
  if (only === undefined) {
    return []
  }

  return tasks.filter(task => isTopOnlyTask({ only, task })).map(addTaskTrue)
}

const isTopOnlyTask = function({ only, task: { key } }) {
  return isMatch(key, only)
}

// Normalize all tasks to only using `task.only`.
// Also make sure task return value always include `task.only: boolean`
const addTaskTrue = function(task) {
  return { ...task, only: true }
}

module.exports = {
  selectOnlyTasks,
}
