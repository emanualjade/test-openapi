import { incrementSpinner } from '../../utils.js'

// Update spinner
const tick = function({ options: { spinner } }) {
  incrementSpinner(spinner)
}

module.exports = {
  tick,
}
