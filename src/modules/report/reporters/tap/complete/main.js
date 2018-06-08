'use strict'

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ task, error, options: { tap } }) {
  const assert = getAssert({ task, error })
  return tap.assert(assert)
}

const getAssert = function({ task: { key, title, aborted }, error }) {
  const ok = error === undefined
  const name = getName({ key, title })
  const directive = { skip: Boolean(aborted) }
  const errorProps = getErrorProps({ ok, error })

  return { ok, name, directive, error: errorProps }
}

const getName = function({ key, title }) {
  if (title.trim() === '') {
    return key
  }

  return `${key} - ${title}`
}

module.exports = {
  complete,
}
