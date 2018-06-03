'use strict'

// Add TAP output for each task, as a single assert
const completeTap = function({
  error,
  config: {
    tap: { writer },
  },
}) {
  const ok = error === undefined

  writer.assert(ok)
}

module.exports = {
  completeTap,
}
