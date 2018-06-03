'use strict'

// Add TAP output for each task, as a single assert
const completeTap = function({
  error,
  config: {
    tap: { writer },
  },
}) {
  const { ok, directive } = getAssert({ error })

  writer.assert(ok, { directive })
}

const getAssert = function({ error }) {
  if (error === undefined) {
    return { ok: true }
  }

  const { skipped } = error
  const skip = skipped === true
  const directive = { skip }

  return { ok: false, directive }
}

module.exports = {
  completeTap,
}
