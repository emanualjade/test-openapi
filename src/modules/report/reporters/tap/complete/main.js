'use strict'

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ options: { tap }, ...task }) {
  const assert = getAssert(task)
  return tap.assert(assert)
}

const getAssert = function({ key, title, aborted, error }) {
  const ok = error === undefined
  const name = getName({ key, title })
  const directive = { skip: Boolean(aborted) }
  const errorProps = getErrorProps({ ok, error })

  return { ok, name, directive, error: errorProps }
}

const getName = function({ key, title }) {
  if (title === undefined || title.trim() === '') {
    return key
  }

  return `${key} - ${title}`
}

module.exports = {
  complete,
}
