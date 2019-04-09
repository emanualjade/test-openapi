const { incrementSpinner } = require('../../utils')

// Update spinner
const tick = function({ options }) {
  incrementSpinner(options.spinner)
}

module.exports = {
  tick,
}
