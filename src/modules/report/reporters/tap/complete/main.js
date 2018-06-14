'use strict'

const { getErrorProps: getProps } = require('../../../error_props')

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ options: { tap }, ...task }, { plugins }) {
  const assert = getAssert({ task, plugins })
  return tap.assert(assert)
}

const getAssert = function({ task, task: { aborted, error }, plugins }) {
  const ok = error === undefined
  const name = getName({ task, plugins })
  const directive = { skip: Boolean(aborted) }
  const errorPropsA = getErrorProps({ ok, error })

  return { ok, name, directive, error: errorPropsA }
}

const getName = function({ task, task: { key }, plugins }) {
  // We are not using other properties from `plugin.report()` because:
  //  - TAP would only allow printing them on errors, not on success
  //  - because of bugs with some TAP parsers, their values cannot be multi-line
  const { title } = getProps({ task, plugins })

  if (title.trim() === '') {
    return key
  }

  return `${key} - ${title}`
}

module.exports = {
  complete,
}
