'use strict'

const { isSimpleSchema } = require('../../../utils')
const { gray, reset } = require('../utils')

// Add core `reportProps`
const addCoreReportProps = function({ reportProps, task }) {
  const coreReportProps = getCoreReportProps(task)
  // Merged with lower priority, and appear at beginning
  return [coreReportProps, ...reportProps]
}

// Core `reportProps` always present on error
const getCoreReportProps = function({
  error: { expected, value, message, property, schema, path, plugin } = {},
}) {
  const values = getValues({ expected, value })
  const schemaA = getJsonSchema({ schema })
  const pathA = prettifyPath({ path })
  const pluginA = getPlugin({ plugin })

  return { message, ...values, property, 'JSON schema': schemaA, path: pathA, plugin: pluginA }
}

// Prettify `error.path` to one line per item, with arrows prepended
const prettifyPath = function({ path }) {
  if (path === undefined) {
    return path
  }

  return path.map(prettifyPathElem).join('\n')
}

const prettifyPathElem = function({ task, property }, index) {
  const indent = getPathIndent({ index })
  // We append two spaces to make it readable when serialized (e.g. in TAP output)
  return `${gray(indent)}${gray('task')} ${reset(task)} ${gray('at')} ${reset(property)}  `
}

const getPathIndent = function({ index }) {
  if (index === 0) {
    return '  '
  }

  return `${RIGHT_ARROW} `
}

// Right arrow Unicode symbol
const RIGHT_ARROW = '\u21aa'

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

// Only report `error.plugin` for external plugins
const getPlugin = function({ plugin }) {
  if (plugin === 'core') {
    return
  }

  return plugin
}

module.exports = {
  addCoreReportProps,
}
