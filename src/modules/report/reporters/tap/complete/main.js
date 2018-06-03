'use strict'

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ task, error, options: { tap } }) {
  const assert = getAssert({ task, error })
  return tap.assert(assert)
}

const getAssert = function({ task, error }) {
  const ok = error === undefined
  const name = getAssertName({ task })

  if (ok) {
    return { ok, name }
  }

  const errorProps = getErrorProps({ error })
  const directive = getDirective({ error })

  return { ok, name, error: errorProps, directive }
}

// Get assert name using `task.key` and `task.titles`
const getAssertName = function({ task: { key, titles } }) {
  if (titles.length === 0) {
    return key
  }

  const titlesA = titles.join(' ')
  return `${key} - ${titlesA}`
}

const getDirective = function({ error: { skipped } }) {
  const skip = skipped === true
  return { skip }
}

module.exports = {
  complete,
}
