'use strict'

const { omit } = require('lodash')

const { convertPlainObject } = require('../../../../../errors')

const { normalizeReportProps } = require('./report_props')

// Retrieve TAP error properties
const getErrorProps = function({
  ok,
  error,
  error: { message, plugin: operator, actual, expected, schema, property, ...rest } = {},
  reportProps,
}) {
  if (ok) {
    return
  }

  // Only report `error.stack` when it's a bug error
  const { stack } = convertPlainObject(error)

  const restA = omit(rest, NOT_REPORTED_PROPS)

  const reportPropsA = normalizeReportProps({ reportProps })

  // Enforce properties order
  return {
    message,
    operator,
    severity: 'fail',
    actual,
    expected,
    schema,
    property,
    stack,
    ...restA,
    ...reportPropsA,
  }
}

const NOT_REPORTED_PROPS = ['config', 'plugins']

module.exports = {
  getErrorProps,
}
