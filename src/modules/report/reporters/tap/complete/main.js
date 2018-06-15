'use strict'

const { getReportProps } = require('../../../props')

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ options: { tap }, ...task }, { plugins }) {
  const assert = getAssert({ task, plugins })
  return tap.assert(assert)
}

const getAssert = function({ task, task: { key, aborted, error }, plugins }) {
  const { title, reportProps } = getReportProps({ task, plugins, noCore: true })

  const ok = error === undefined
  const name = getName({ key, title })
  const directive = { skip: Boolean(aborted) }
  const errorProps = getErrorProps({ ok, error, reportProps })

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
