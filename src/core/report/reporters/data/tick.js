import { incrementSpinner } from '../../utils.js'

// Update spinner
export const tick = function({ options }) {
  incrementSpinner(options.spinner)
}
