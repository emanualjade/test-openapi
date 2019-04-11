import { capitalize } from 'underscore.string'

import { isObject } from '../../../../../utils/types.js'
import { yellow, orange } from '../../../utils/colors.js'
import { indent, indentValue } from '../../../utils/indent.js'
import { stringify } from '../../../utils/stringify.js'

// Print/prettify all `plugin.report()` return values
export const printReportProps = function({ reportProps, resultType }) {
  if (resultType === 'skip' || Object.keys(reportProps).length === 0) {
    return ''
  }

  const reportPropsA = Object.entries(reportProps)
    .map(printTopPair)
    .join('\n\n')

  return `\n\n${indent(reportPropsA)}`
}

// Print top-level level pairs
const printTopPair = function([name, value]) {
  const valueA = printReportProp(value)
  return `${orange(`${capitalize(name)}:`)} ${indentValue(valueA)}`
}

// Print `error.*` properties in error printed message
// Do it each second depth level, i.e. under error.PLUGIN_NAME.*
const printReportProp = function(value) {
  // There is no second depth level, e.g. core `reportProps` or plugin which
  // returns a primitive type
  if (!isObject(value)) {
    return stringify(value)
  }

  if (Object.keys(value).length === 0) {
    return '{}'
  }

  const valueA = Object.entries(value)
    .map(printDeepPair)
    .join('\n')
  // Make sure it is on next value
  return `\n${valueA}`
}

// Print second-depth level pairs
const printDeepPair = function([name, value]) {
  const valueA = stringify(value)
  return `${yellow(name)}: ${indentValue(valueA)}`
}
