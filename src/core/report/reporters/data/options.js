import { startSpinner } from '../../utils.js'

// Add a CLI spinner updated with each complete task
const options = function({ _tasks: tasks }) {
  const spinner = startSpinner({ total: tasks.length })
  return { spinner }
}

module.exports = {
  options,
}
