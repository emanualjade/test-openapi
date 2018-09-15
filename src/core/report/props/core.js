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
  error: { expected, value, message, property, schema, module } = {},
}) {
  const values = getValues({ expected, value })
  const schemaA = getJsonSchema({ schema })
  const propertyA = getProperty({ property })
  const moduleA = getModule({ module })

  return {
    message,
    ...values,
    property: propertyA,
    'JSON schema': schemaA,
    ...moduleA,
  }
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

const getProperty = function({ property }) {
  if (property === undefined) {
    return
  }

  return property.replace(/^task\./, '')
}

// From `module: plugin|reporter-NAME` to `Plugin|Reporter: NAME`
const getModule = function({ module }) {
  if (module === undefined) {
    return
  }

  const [type, ...name] = module.split('-')
  const nameA = name.join('-')

  return { [type]: nameA }
}

module.exports = {
  addCoreReportProps,
}
