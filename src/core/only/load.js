'use strict'

const { isMatch } = require('micromatch')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: anyValue` will only run those tasks
const load = function(tasks, { config: { only: patterns } }) {
  // Check if `config|task.only` is used, so we know whether to perform an `only` run
  const enabled = patterns !== undefined || tasks.some(({ only }) => only !== undefined)
  if (!enabled) {
    return
  }

  const tasksA = tasks.map(task => addExcluded({ task, patterns }))
  return tasksA
}

const addExcluded = function({ task, task: { only, key }, patterns }) {
  if (isOnly({ only, patterns, key })) {
    return task
  }

  // As opposed to `skip` plugin, we need to set `excluded` not `skipped`
  return { ...task, excluded: true }
}

// Any value in `task.only` will be same as `true`. See `skip` plugin for explanation.
const isOnly = function({ only, patterns, key }) {
  return only !== undefined || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  load,
}
