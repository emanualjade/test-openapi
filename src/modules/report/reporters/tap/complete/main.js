'use strict'

const { getResultType, SEPARATOR } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function({ options: { tap }, ...task }, { config, startData, plugins, silent }) {
  const assert = getAssert({ task, config, startData, plugins })
  const message = tap.assert(assert)

  if (silent) {
    return ''
  }

  return message
}

const getAssert = function({ task, task: { key, path }, config, startData, plugins }) {
  const { title, reportProps } = getReportProps({ task, config, startData, plugins })

  const resultType = getResultType(task)

  const ok = resultType !== 'fail'
  const name = getName({ key, path, title })
  const directive = { skip: resultType === 'skip' }
  const errorProps = getErrorProps({ ok, reportProps })

  return { ok, name, directive, error: errorProps }
}

const getName = function({ key, path, title }) {
  return [key, path, title]
    .map(string => string.trim())
    .filter(string => string !== '')
    .join(SEPARATOR)
}

module.exports = {
  complete,
}
