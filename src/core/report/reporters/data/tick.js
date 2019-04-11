import { incrementSpinner } from '../../utils/spinner.js'

// Update spinner
export const tick = function({ options }) {
  incrementSpinner(options.spinner)
}
