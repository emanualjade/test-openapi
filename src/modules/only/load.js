'use strict'

const { isMatch } = require('micromatch')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: anyValue` will only run those tasks
// Works similarly as `skip` plugin
const load = function({ tasks }, { config: { only: patterns } }) {
  // Check if `config|task.only` is used, so we know whether to perform an `only` run
  const enabled = patterns !== undefined || tasks.some(({ only }) => only !== undefined)
  if (!enabled) {
    return
  }

  const tasksA = tasks.map(task => addSkipped({ task, patterns }))
  return { tasks: tasksA }
}

const addSkipped = function({ task, task: { only, key }, patterns }) {
  if (isOnly({ only, patterns, key })) {
    return task
  }

  return { ...task, skipped: true }
}

const isOnly = function({ only, patterns, key }) {
  return only !== undefined || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  load,
}
