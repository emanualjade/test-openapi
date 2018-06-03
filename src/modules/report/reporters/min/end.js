'use strict'

// Clears spinner
const end = function({ options: { spinner } }) {
  spinner.stop()
}

module.exports = {
  end,
}
