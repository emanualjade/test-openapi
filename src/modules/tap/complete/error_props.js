'use strict'

const { omit } = require('lodash')

// Retrieve TAP error properties
const getErrorProps = function({
  error: {
    name,
    message,
    stack,
    plugin: operator,
    actual,
    expected,
    schema,
    property,
    task,
    ...error
  },
}) {
  const stackProp = getStackProp({ name, stack })

  const errorA = omit(error, NOT_REPORTED_PROPS)
  const taskA = omit(task, NOT_REPORTED_TASK_PROPS)

  // Enforce properties order
  const errorProps = {
    message,
    operator,
    severity: 'fail',
    actual,
    expected,
    schema,
    property,
    ...stackProp,
    task: taskA,
    ...errorA,
  }
  return errorProps
}

const NOT_REPORTED_PROPS = ['config', 'plugins']
const NOT_REPORTED_TASK_PROPS = ['titles']

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
