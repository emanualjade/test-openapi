'use strict'

// Ends TAP v13 output
const endTap = function({
  config: {
    tap: { writer },
  },
}) {
  writer.close()
}

module.exports = {
  endTap,
}
