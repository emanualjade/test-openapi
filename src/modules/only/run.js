'use strict'

const { isMatch } = require('micromatch')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: anyValue` will only run those tasks
// Behaves similarly to `skip` plugin
const run = function(
  { only, key },
  {
    config: {
      only: { patterns, enabled },
    },
  },
  { nestedPath },
) {
  // Nested tasks are not skipped
  if (!enabled || nestedPath !== undefined || isOnly({ only, patterns, key })) {
    return
  }

  return { done: true, skipped: true }
}

const isOnly = function({ only, patterns, key }) {
  return only !== undefined || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  run,
}
