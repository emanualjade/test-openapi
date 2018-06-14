'use strict'

const { omit, omitBy, mapKeys } = require('lodash')
const { capitalize } = require('underscore.string')

const { getCoreErrorProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getErrorProps = function({ task: { originalTask, ...task }, plugins, noCore = false }) {
  const { titles, errorProps } = callReportFuncs({ task, plugins })

  const title = getTitle({ titles })

  const errorPropsA = addCoreErrorProps({ errorProps, task, noCore })

  const errorPropsB = errorPropsA.map(removeEmptyProps)

  const originalProps = getOriginalProps({ originalTask })

  // Merge all `plugin.report()` results
  const errorPropsC = Object.assign({}, ...errorPropsB, originalProps)

  return { title, errorProps: errorPropsC }
}

// Find and call all `plugin.report()`
const callReportFuncs = function({ task, plugins }) {
  const reportResult = plugins
    .map(plugin => callReportFunc({ plugin, task }))
    .filter(value => value !== undefined)

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title)
  const errorProps = reportResult.map(errorProps => omit(errorProps, 'title'))

  return { titles, errorProps }
}

// Call `plugin.report()`
const callReportFunc = function({ plugin: { report, name }, task }) {
  if (report === undefined) {
    return
  }

  return report(task[name])
}

// Retrieve printed task title by concatenating all `title` from `plugin.report()`
// result
const getTitle = function({ titles }) {
  return titles.filter(isDefinedTitle).join(' ')
}

const isDefinedTitle = function(title) {
  return title !== undefined && title.trim() !== ''
}

// Add core `errorProps`
// Enforce properties order
const addCoreErrorProps = function({ errorProps, task, noCore }) {
  if (noCore) {
    return errorProps
  }

  const coreErrorProps = getCoreErrorProps(task)
  return [coreErrorProps, ...errorProps]
}

const getOriginalProps = function({ originalTask }) {
  const originalTaskA = removeEmptyProps(originalTask)
  const originalTaskB = mapKeys(originalTaskA, normalizeOriginalTaskKey)
  return originalTaskB
}

const normalizeOriginalTaskKey = function(value, name) {
  return capitalize(name)
}

// Do not print properties that are not present
const removeEmptyProps = function(object) {
  return omitBy(object, value => value === undefined)
}

module.exports = {
  getErrorProps,
}
