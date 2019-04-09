import { incrementSpinner } from '../../utils.js'

// Update spinner
const tick = function({ options }) {
  incrementSpinner(options.spinner)
}

module.exports = {
  tick,
}
