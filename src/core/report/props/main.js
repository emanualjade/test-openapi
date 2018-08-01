'use strict'

const { omit, omitBy } = require('lodash')

const { isObject, merge } = require('../../../utils')

const { addCoreReportProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getReportProps = function({ task, config, startData, plugins }) {
  const { titles, reportProps } = callReportFuncs({ task, config, startData, plugins })

  const title = getTitle({ titles })

  const reportPropsA = addCoreReportProps({ reportProps, task })

  const reportPropsB = reportPropsA.map(removeEmptyProps)

  // Merge all `plugin.report()` results
  // Reporting order should still follow plugins order and
  // core props < core plugins < user plugins
  const reportPropsC = merge(...reportPropsB)

  return { title, reportProps: reportPropsC }
}

// Find and call all `plugin.report()`
const callReportFuncs = function({ task, config, startData, plugins }) {
  const pluginNames = plugins.map(({ name }) => name)

  // Reporting order will follow core plugins order, then user `config.plugins` order
  const reportResult = plugins
    .map(plugin => callReportFunc({ plugin, config, startData, pluginNames, task }))
    .filter(value => value !== undefined)

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title)
  const reportProps = reportResult.map(props => omit(props, 'title'))

  return { titles, reportProps }
}

// Call `plugin.report()`
const callReportFunc = function({
  plugin: { report, name },
  config,
  startData,
  pluginNames,
  task,
}) {
  const taskValue = task[name]

  // If no `plugin.report()`, reports task as is
  if (report === undefined) {
    return { [name]: taskValue }
  }

  const newValue = report(taskValue, { config, startData, pluginNames })

  // If not an object, including `undefined`, no need to merge or destructure
  if (!isObject(newValue)) {
    return { [name]: newValue }
  }

  const { title, ...reportProps } = newValue

  // Merge `plugin.report()` to task.PLUGIN.*
  // It should have priority, but also be first in properties order
  const reportPropsA = { ...reportProps, ...taskValue, ...reportProps }

  // Returning `undefined` properties from `plugin.report()` unsets them
  const reportPropsB = removeEmptyProps(reportPropsA)

  if (Object.keys(reportPropsB).length === 0 && taskValue === undefined) {
    return { title }
  }

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
