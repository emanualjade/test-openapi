'use strict'

const { mapValues, mapKeys } = require('lodash')
const { underscored } = require('underscore.string')

const { removeColors, stringifyValue, truncate } = require('../../../utils')

// Retrieve TAP error properties
const getErrorProps = function({ ok, reportProps }) {
  if (ok) {
    return
  }

  const reportPropsA = normalizeReportProps({ reportProps })

  // Enforce properties order
  const { message, operator, expected, actual, schema, property, ...rest } = reportPropsA

  return { message, operator, severity: 'fail', expected, actual, schema, property, ...rest }
}

// `plugin.report()` is optimized for `pretty` reporter
// With TAP we want to:
//  - exclude core report properties, because we directly use `error.*` and
//    make sure they becomes valid/common TAP error properties
//  - newlines should be escaped, because of bugs with some TAP parsers
//  - only print them on errors, as successes should not have properties
//    according to TAP
//  - remove ANSI color sequences
//  - rename keys to underscore style
const normalizeReportProps = function({ reportProps }) {
  const reportPropsA = mapValues(reportProps, normalizeReportPropValue)
  const reportPropsB = mapKeys(reportPropsA, normalizeReportPropKey)
  return reportPropsB
}

const normalizeReportPropValue = function(value) {
  const valueA = removeColors(value)
  const valueB = normalizeObject(valueA)
  return valueB
}

const normalizeObject = function(value) {
  // We serialize objects and arrays:
  //  - so that they can be truncated
  //  - to avoid too many backslash escaping in output
  // But numbers, booleans, etc. should remain as is otherwise they will appear
  // quoted in output.
  if (typeof value !== 'object' || value === null) {
    return value
  }

  const string = stringifyValue(value)
  const stringA = truncate({ string, colors: false })
  return stringA
}

const normalizeReportPropKey = function(value, name) {
  const tapName = TAP_NAMES[name]
  if (tapName !== undefined) {
    return tapName
  }

  return underscored(name)
}

// Rename core properties names to names common in TAP output
const TAP_NAMES = {
  message: 'message',
  plugin: 'operator',
  'expected value': 'expected',
  'actual value': 'actual',
  'JSON schema': 'schema',
  property: 'property',
}

module.exports = {
  getErrorProps,
}
