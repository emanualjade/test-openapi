'use strict'

const { omit, omitBy } = require('lodash')
const { mergeAll } = require('lodash/fp')

const { getAddedProps } = require('../../../utils')

const { addCoreErrorProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getErrorProps = function({ task: { originalTask, ...task }, plugins, noCore = false }) {
  const { titles, errorProps } = callReportFuncs({ task, originalTask, plugins })

  const title = getTitle({ titles })

  const errorPropsA = addCoreErrorProps({ errorProps, task, noCore })

  const errorPropsB = errorPropsA.map(removeEmptyProps)

  // Merge all `plugin.report()` results
  const errorPropsC = mergeAll(errorPropsB)

  return { title, errorProps: errorPropsC }
}

// Find and call all `plugin.report()`
const callReportFuncs = function({ task, originalTask, plugins }) {
  const reportResult = plugins
    .map(plugin => callReportFunc({ plugin, task, originalTask }))
    .filter(value => value !== undefined)

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title)
  const errorProps = reportResult.map(errorProps => omit(errorProps, 'title'))

  return { titles, errorProps }
}

// Call `plugin.report()`
const callReportFunc = function({ plugin, plugin: { report, name }, task, originalTask }) {
  const { title, ...errorProps } = callReport({ report, plugin, task })

  const errorPropsA = addOriginalTask({ errorProps, originalTask, name })

  // If there is no `task.*`, do not report anything
  if (Object.keys(errorPropsA).length === 0) {
    return { title }
  }

  return { title, [name]: errorPropsA }
}

const callReport = function({ report, plugin, plugin: { name }, task }) {
  if (report !== undefined) {
    return report(task[name])
  }

  // By default, `plugin.report()` returns all the properties that haven been
  // added by the plugin but are not part of `plugin.config.task.*`
  return getAddedProps({ task, plugin })
}

// Add `originalTask.*` to `errorProps`
// Merged with lower priority, but should appear at end
const addOriginalTask = function({ errorProps, originalTask, name }) {
  return { ...errorProps, ...originalTask[name], ...errorProps }
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
const removeEmptyProps = function(object) {
  return omitBy(object, value => value === undefined)
}

module.exports = {
  getErrorProps,
}
