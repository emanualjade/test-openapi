'use strict'

const { getEndMessage } = require('../../print')

// Clears spinner and print final counters message
const end = function({ options: { spinner }, tasks }) {
  spinner.stop()

  const endMessage = getEndMessage({ tasks })
  return endMessage
}

module.exports = {
  end,
}
