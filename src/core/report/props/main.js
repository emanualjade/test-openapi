'use strict'

const { omit, omitBy } = require('lodash')

const { isObject, merge } = require('../../../utils')

const { addCoreReportProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getReportProps = function({ task, context }) {
  const { titles, reportProps } = callReportFuncs({ task, context })

  const reportPropsA = addCoreReportProps({ reportProps, task })

  const reportPropsB = reportPropsA.map(removeEmptyProps)

  // Merge all `plugin.report()` results
  // Reporting order should still follow plugins order and
  // core props < core plugins < user plugins
  const reportPropsC = merge(...reportPropsB)

  return { titles, reportProps: reportPropsC }
}

// Find and call all `plugin.report()`
const callReportFuncs = function({
  task,
  context,
  context: { _plugins: plugins },
}) {
  // Reporting order will follow core plugins order, then user `config.plugins` order
  const reportResult = plugins.map(plugin =>
    callReportFunc({ plugin, context, task }),
  )

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title).filter(isDefinedTitle)
  const reportProps = reportResult.map(props => omit(props, 'title'))

  return { titles, reportProps }
}

// Call `plugin.report()`
const callReportFunc = function({ plugin: { report, name }, context, task }) {
  const taskValue = task[name]

  // If no `plugin.report()`, reports task as is
  if (report === undefined) {
    return { [name]: taskValue }
  }

  const contextA = omit(context, ['options', 'silent'])
  const newValue = report(taskValue, contextA)

  // If not an object, including `undefined`, no need to merge or destructure
  if (!isObject(newValue)) {
    return { [name]: newValue }
  }

  const { title, ...reportProps } = newValue

  // Merge `plugin.report()` to task.PLUGIN.*
  // It should have priority, but also be first in properties order
  const reportPropsA = { ...reportProps, ...taskValue, ...reportProps }

  // `plugin.report()` can return `undefined` to remove `task.*` from output
  const reportPropsB = removeEmptyProps(reportPropsA)

  if (Object.keys(reportPropsB).length === 0 && taskValue === undefined) {
    return { title }
  }

  return { title, [name]: reportPropsB }
}

const isDefinedTitle = function(title) {
  return title !== undefined && title.trim() !== ''
}

// Do not print properties that are not present
const removeEmptyProps = function(object) {
  return omitBy(object, value => value === undefined)
}

module.exports = {
  getReportProps,
}
