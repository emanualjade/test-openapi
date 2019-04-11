import { startSpinner } from '../../utils/spinner.js'

// Add a CLI spinner updated with each complete task
export const options = function({ _tasks: { length: total } }) {
  const spinner = startSpinner({ total })
  return { spinner }
}
