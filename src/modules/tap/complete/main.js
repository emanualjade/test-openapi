'use strict'

const { getAssertName } = require('./name')
const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const completeTap = function({
  task,
  error,
  config: {
    tap: { writer },
  },
}) {
  const assert = getAssert({ task, error })
  writer.assert(assert)
}

const getAssert = function({ task, error }) {
  const ok = error === undefined
  const name = getAssertName({ task, error })

  if (ok) {
    return { ok, name }
  }

  const errorProps = getErrorProps({ error })
  const directive = getDirective({ error })

  return { ok, name, error: errorProps, directive }
}

const getDirective = function({ error: { skipped } }) {
  const skip = skipped === true
  return { skip }
}

module.exports = {
  completeTap,
}
