'use strict'

const { mapValues } = require('lodash')

const { getEvalTask } = require('./eval')

// `task.alias.$$NAME: '[PATH] [OPTS]'` allows using `$$NAME` in any task, to
// run the task that defined the alias, and retrieve a specific property at `PATH`
// It does so by adding those helpers to `startData.helpers`.
const start = function({ helpers }, { config: { _allTasks: allTasks } }) {
  const aliasHelpers = allTasks.map(getTaskHelpers)
  const aliasHelpersA = Object.assign({}, ...aliasHelpers)

  return { helpers: { ...helpers, ...aliasHelpersA } }
}

const getTaskHelpers = function({ key, alias }) {
  if (alias === undefined) {
    return
  }

  // Cannot use `Function.bind()` without losing `function.context: true`
  const taskHelpers = mapValues(alias, value => getEvalTask({ key, value }))
  return taskHelpers
}

module.exports = {
  start,
}
