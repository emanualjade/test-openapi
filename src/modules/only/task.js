'use strict'

const { isMatch } = require('micromatch')

const { abortTask } = require('../../errors')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: true` will only run those tasks
// Behaves similarly to `skip` plugin
const selectOnlyTasks = function({
  only,
  config: {
    only: { patterns, enabled },
  },
  key,
}) {
  if (!enabled || isOnly({ only, patterns, key })) {
    return
  }

  abortTask()
}

const isOnly = function({ only, patterns, key }) {
  return only || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  selectOnlyTasks,
}
