const { incrementSpinner } = require('../../utils')

// Update spinner
const tick = function({ options: { spinner } }) {
  incrementSpinner(spinner)
}

module.exports = {
  tick,
}
