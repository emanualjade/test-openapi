'use strict'

const { getResultType, SEPARATOR } = require('../../../utils')
const { getReportProps } = require('../../../props')

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const complete = function(task, { options: { tap }, silent, ...context }) {
  const assert = getAssert({ task, context })
  const message = tap.assert(assert)

  if (silent) {
    return ''
  }

  return message
}

const getAssert = function({ task, task: { key, path }, context }) {
  const { titles, reportProps } = getReportProps({ task, context })

  const resultType = getResultType(task)

  const ok = resultType !== 'fail'
  const name = getName({ key, path, titles })
  const directive = { skip: resultType === 'skip' }
  const errorProps = getErrorProps({ ok, reportProps })

  return { ok, name, directive, error: errorProps }
}

const getName = function({ key, path, titles }) {
  return [key, path, ...titles]
    .map(string => string.trim())
    .filter(string => string !== '')
    .join(SEPARATOR)
}

module.exports = {
  complete,
}
