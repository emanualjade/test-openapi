'use strict'

const { getErrorMessage } = require('../../print')

// Print task errors and update spinner
const complete = function({ options: { spinner }, ...task }, { plugins }) {
  const failed = task.error !== undefined

  spinner.update({ clear: failed })

  if (!failed) {
    return
  }

  const errorMessage = getErrorMessage({ task, plugins })
  return errorMessage
}

module.exports = {
  complete,
}
