'use strict'

const { omit, omitBy } = require('lodash')
const { mergeAll } = require('lodash/fp')

const { isObject } = require('../../../utils')

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

  // Merge `plugin.report()` to task.PLUGIN.*
  // It should have priority, but also be first in properties order
  const { title, ...errorProps } = { ...newValue, ...taskValue, ...newValue }
  return { title, [name]: errorProps }
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
// If we want to report some properties that are `undefined`, they must be
// converted to a string `'undefined'`. This is for example done for core
// properties `actual` and `expected` (providing their key was defined on
// `error` object)
const removeEmptyProps = function(object) {
  return omitBy(object, value => value === undefined)
}

module.exports = {
  getErrorProps,
}
