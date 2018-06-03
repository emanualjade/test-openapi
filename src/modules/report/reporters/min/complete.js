'use strict'

const { getErrorMessage } = require('./print')

// Print task errors and update spinner
const complete = function({ task, error, options: { spinner } }) {
  const failed = error !== undefined

  spinner.update({ clear: failed })

  if (!failed) {
    return
  }

  const errorMessage = getErrorMessage({ task, error })
  return errorMessage
}

module.exports = {
  complete,
}
