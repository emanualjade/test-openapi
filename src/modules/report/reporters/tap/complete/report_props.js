'use strict'

const stripAnsi = require('strip-ansi')
const { mapValues, mapKeys } = require('lodash')
const { underscored } = require('underscore.string')

const { stringifyFlat } = require('../../../../../utils')

// `plugin.report()` is optimized for `pretty` reporter
// With TAP we want to:
//  - exclude core report properties, because we directly use `error.*` and
//    make sure they becomes valid/common TAP error properties
//  - escape newlines, because of bugs with some TAP parsers
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
  const valueA = stripAnsi(value)
  const valueB = stringifyFlat(valueA)
  return valueB
}

const normalizeReportPropKey = function(value, name) {
  return underscored(name)
}

module.exports = {
  normalizeReportProps,
}
