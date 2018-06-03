'use strict'

// Start TAP v13 output
const start = function({ options: { tap } }) {
  return tap.start()
}

module.exports = {
  start,
}
