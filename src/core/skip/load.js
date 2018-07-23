'use strict'

const { isMatch } = require('micromatch')

// `task.skip: anyValue` will skip those tasks
// Can also use `config.skip: 'glob' or ['glob', ...]`
const load = function(tasks, { config: { skip: patterns } }) {
  const tasksA = tasks.map(task => addSkipped({ task, patterns }))
  return tasksA
}

const addSkipped = function({ task, task: { skip, key }, patterns }) {
  if (!isSkipped({ skip, patterns, key })) {
    return task
  }

  return { ...task, skipped: true }
}

// Any value in `task.skip` will be same as `true`. This is because templates
// are not evaluated yet, so we can't assume what the value is. But we still want
// the `skip` plugin to be performed before templating, as templating takes some time.
const isSkipped = function({ skip, patterns, key }) {
  return skip !== undefined || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  load,
}
