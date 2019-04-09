const { startSpinner } = require('../../utils')

// Add a CLI spinner updated with each complete task
const options = function({ _tasks: { length: total } }) {
  const spinner = startSpinner({ total })
  return { spinner }
}

module.exports = {
  options,
}
