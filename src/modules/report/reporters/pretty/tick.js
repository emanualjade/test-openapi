'use strict'

// Update spinner
const tick = function({ options: { spinner } }) {
  spinner.update()
}

module.exports = {
  tick,
}
