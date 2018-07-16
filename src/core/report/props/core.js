'use strict'

const { isSimpleSchema } = require('../../../utils')

// Add core `reportProps`
const addCoreReportProps = function({ reportProps, task }) {
  const coreReportProps = getCoreReportProps(task)
  // Merged with lower priority, and appear at beginning
  return [coreReportProps, ...reportProps]
}

// Core `reportProps` always present on error
const getCoreReportProps = function({
  error: { expected, value, message, property, schema, plugin } = {},
}) {
  const values = getValues({ expected, value })
  const schemaA = getJsonSchema({ schema })

  return { message, ...values, property, 'JSON schema': schemaA, plugin }
}

const getValues = function({ expected, value }) {
  if (expected === undefined) {
    return { value }
  }

  return { 'actual value': value, 'expected value': expected }
}

const getJsonSchema = function({ schema }) {
  // Do not print JSON schemas which are simplistic, as they do not provide extra
  // information over `Expected value`
  if (isSimpleSchema(schema)) {
    return
  }

  return schema
}

module.exports = {
  addCoreReportProps,
}
