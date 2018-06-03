'use strict'

const ora = require('ora')

// CLI spinner showing `INDEX/TOTAL` next to it (like a progress bar)
class Spinner {
  // Start the spinner
  constructor({ index = 0, total }) {
    const instance = ora({ ...ORA_OPTS })

    Object.assign(this, { index, total, instance })

    this.updateText()

    this.instance.start()
  }

  updateText() {
    this.index++

    this.instance.text = `${this.index}/${this.total}`
  }

  // Increment CLI spinner index
  update({ clear = false }) {
    this.updateText()

    if (!clear) {
      return
    }

    // If `clear` `true`, temporarily hide the spinner, so that some output can
    // be done without the spinner persisting in terminal
    this.instance.clear()
  }

  // Remove the CLI spinner
  stop() {
    this.instance.stop()
  }
}

const ORA_OPTS = {
  spinner: 'dots12',
}

module.exports = {
  Spinner,
}
