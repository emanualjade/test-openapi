'use strict'

// Update spinner
const complete = function({ options: { spinner } }) {
  spinner.update()
}

module.exports = {
  complete,
}
