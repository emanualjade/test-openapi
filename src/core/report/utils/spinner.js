const ora = require('ora')

// CLI spinner showing `INDEX/TOTAL` next to it (like a progress bar)
// Start the spinner
const startSpinner = function({ index = -1, total }) {
  const instance = ora(ORA_OPTS)

  const state = { index, total, instance }

  incrementSpinner(state)

  instance.start()

  return state
}

// Increment CLI spinner index
const incrementSpinner = function(state) {
  // We need to mutate state because the spinner is shared by parallel tasks
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.index += 1

  const { index, total, instance } = state
  // eslint-disable-next-line fp/no-mutation
  instance.text = `${index}/${total}`
}

// Temporarily hide the spinner, so that some output can be done without the
// spinner persisting in terminal
const clearSpinner = function({ instance }) {
  instance.clear()
}

// Remove the CLI spinner
const stopSpinner = function({ instance }) {
  instance.stop()
}

const ORA_OPTS = {
  spinner: 'dots12',
}

module.exports = {
  startSpinner,
  incrementSpinner,
  clearSpinner,
  stopSpinner,
}
