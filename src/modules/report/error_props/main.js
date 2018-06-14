'use strict'

const { omitBy } = require('lodash')

const { getCoreErrorProps } = require('./core')

// Get plugin-specific properties printed on reporting
const getErrorProps = function({ task, plugins }) {
  const reportFuncs = getReportFuncs({ plugins })

  const { titles, errorProps } = callReportFuncs({ reportFuncs, task })

  const title = getTitle({ titles })

  return { title, errorProps }
}

// Find all `plugin.report()`
const getReportFuncs = function({ plugins }) {
  const reportFuncs = plugins
    .map(({ report }) => report)
    .filter(reportFunc => reportFunc !== undefined)

  const reportFuncsA = [getCoreErrorProps, ...reportFuncs]
  return reportFuncsA
}

// Call all `plugin.report()`
const callReportFuncs = function({ reportFuncs, task }) {
  const reportResult = reportFuncs.map(reportFunc => callReportFunc({ reportFunc, task }))

  // Separate `title` from the rest as it is handled differently
  const titles = reportResult.map(({ title }) => title)
  const errorProps = reportResult.map(({ errorProps }) => errorProps)

  // Merge all `plugin.report()` results
  const errorPropsA = Object.assign({}, ...errorProps)

  return { titles, errorProps: errorPropsA }
}

// Call single `plugin.report()`
const callReportFunc = function({ reportFunc, task }) {
  const errorProps = reportFunc(task)

  const { title, ...errorPropsA } = omitBy(errorProps, isEmptyProp)

  return { title, errorProps: errorPropsA }
}

// Do not print error.* properties that are not present
const isEmptyProp = function(value) {
  return value === undefined
}

// Retrieve printed task title by concatenating all `title` from `plugin.report()`
// result
const getTitle = function({ titles }) {
  return titles.filter(title => title !== undefined && title.trim() !== '').join(' ')
}

module.exports = {
  getErrorProps,
}
