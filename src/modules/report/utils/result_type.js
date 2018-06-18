'use strict'

// Get whether a `task` failed, passed or was skipped
const getResultType = function({ error, skipped }) {
  if (error !== undefined) {
    return 'fail'
  }

  if (skipped) {
    return 'skip'
  }

  return 'pass'
}

module.exports = {
  getResultType,
}
