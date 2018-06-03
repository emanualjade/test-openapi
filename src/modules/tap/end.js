'use strict'

// Ends TAP v13 output
// Write # tests|pass|fail|skip|ok comments at the end
const endTap = function({
  config: {
    tap: { writer },
  },
}) {
  writer.end()
}

module.exports = {
  endTap,
}
