'use strict'

const { omit, omitBy } = require('lodash')
const { mergeAll } = require('lodash/fp')

const { isObject } = require('../../../utils')

const { addCoreReportProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getReportProps = function({ task, plugins, noCore = false }) {
  const { titles, reportProps } = callReportFuncs({ task, plugins })

  const title = getTitle({ titles })

  const reportPropsA = addCoreReportProps({ reportProps, task, noCore })

  const reportPropsB = reportPropsA.map(removeEmptyProps)

  // Merge all `plugin.report()` results
  const reportPropsC = mergeAll(reportPropsB)

  return { title, reportProps: reportPropsC }
}

// Find and call all `plugin.report()`
const callReportFuncs = function({ task, plugins }) {
  const reportResult = plugins
    .map(plugin => callReportFunc({ plugin, task }))
    .filter(value => value !== undefined)

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title)
  const reportProps = reportResult.map(props => omit(props, 'title'))

  return { titles, reportProps }
}

// Call `plugin.report()`
const callReportFunc = function({ plugin: { report, name }, task }) {
  const taskValue = task[name]

  // If no `plugin.report()`, reports task as is
  if (report === undefined) {
    return { [name]: taskValue }
  }

  const newValue = report(taskValue)

  // If not an object, including `undefined`, no need to merge or destructure
  if (!isObject(newValue)) {
    return { [name]: newValue }
  }

  const { title, ...reportProps } = newValue

  // If `plugin.report()` does not return any new props, do not merge as it would
  // set an empty object even when `taskValue` is `undefined`
  if (Object.keys(reportProps).length === 0) {
    return { [name]: taskValue }
  }

  // Merge `plugin.report()` to task.PLUGIN.*
  // It should have priority, but also be first in properties order
  const reportPropsA = { ...reportProps, ...taskValue, ...reportProps }

  // Returning `undefined` properties from `plugin.report()` unsets them
  const reportPropsB = removeEmptyProps(reportPropsA)

  return { title, [name]: reportPropsB }
}

// Retrieve printed task title by concatenating all `title` from `plugin.report()`
// result
const getTitle = function({ titles }) {
  return titles.filter(isDefinedTitle).join(' ')
}

const isDefinedTitle = function(title) {
  return title !== undefined && title.trim() !== ''
}

// Do not print properties that are not present
// It's not possible to report properties as `undefined`. The reasons are:
//  - it makes it simpler to reason about reporting
//  - `undefined` is not JSON serializable
const removeEmptyProps = function(object) {
  return omitBy(object, value => value === undefined)
}

module.exports = {
  getReportProps,
}
