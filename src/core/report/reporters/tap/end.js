'use strict'

// Ends TAP v13 output
// Write # tests|pass|fail|skip|ok comments at the end
const end = function({ options: { tap } }) {
  return tap.end()
}

module.exports = {
  end,
}
