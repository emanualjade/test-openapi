'use strict'

// Get whether a `task` failed, passed or was skipped
const getResultType = function({ error, aborted }) {
  if (error !== undefined) {
    return 'fail'
  }

  if (aborted) {
    return 'skip'
  }

  return 'pass'
}

module.exports = {
  getResultType,
}
