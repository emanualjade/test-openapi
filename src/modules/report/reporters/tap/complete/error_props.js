'use strict'

const { omit } = require('lodash')

const { normalizeReportProps } = require('./report_props')

// Retrieve TAP error properties
const getErrorProps = function({
  ok,
  error: {
    name,
    message,
    stack,
    plugin: operator,
    actual,
    expected,
    schema,
    property,
    ...error
  } = {},
  reportProps,
}) {
  if (ok) {
    return
  }

  const stackProp = getStackProp({ name, stack })

  const errorA = omit(error, NOT_REPORTED_PROPS)

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
    ...stackProp,
    ...errorA,
    ...reportPropsA,
  }
}

const NOT_REPORTED_PROPS = ['config', 'plugins']

// Only report `error.stack` when it's a bug error
const getStackProp = function({ name, stack }) {
  if (name === 'TestOpenApiError') {
    return {}
  }

  return { stack }
}

module.exports = {
  getErrorProps,
}
