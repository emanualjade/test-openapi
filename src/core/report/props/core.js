import { isSimpleSchema } from '../../../utils/simple_schema.js'

// Add core `reportProps`
export const addCoreReportProps = function({ reportProps, task }) {
  const coreReportProps = getCoreReportProps(task)
  // Merged with lower priority, and appear at beginning
  return [coreReportProps, ...reportProps]
}

// Core `reportProps` always present on error
const getCoreReportProps = function({
  error: {
    expected,
    value,
    message,
    property,
    schema,
    module: moduleProp,
  } = {},
}) {
  const values = getValues({ expected, value })
  const schemaA = getJsonSchema({ schema })
  const propertyA = getProperty({ property })
  const modulePropA = getModule({ moduleProp })

  return {
    message,
    ...values,
    property: propertyA,
    'JSON schema': schemaA,
    ...modulePropA,
  }
}

const getValues = function({ expected, value }) {
  if (expected === undefined) {
    return { value }
  }

  return { 'actual value': value, 'expected value': expected }
}

const getJsonSchema = function({ schema }) {
  // Do not print JSON schemas which are simplistic, as they do not provide
  // extra information over `Expected value`
  if (isSimpleSchema(schema)) {
    return
  }

  return schema
}

const getProperty = function({ property }) {
  if (property === undefined) {
    return
  }

  return property.replace(PROPERTY_REGEXP, '')
}

const PROPERTY_REGEXP = /^task\./u

// From `module: plugin|reporter-NAME` to `Plugin|Reporter: NAME`
const getModule = function({ moduleProp }) {
  if (moduleProp === undefined) {
    return
  }

  const [type, ...name] = moduleProp.split('-')
  const nameA = name.join('-')

  return { [type]: nameA }
}
