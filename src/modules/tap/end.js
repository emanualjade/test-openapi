'use strict'

// Ends TAP v13 output
const endTap = function({
  config: {
    tap: { writer },
  },
}) {
  // Write # tests|pass|fail|skip|ok comments at the end
  writer.end()
}

module.exports = {
  endTap,
}
