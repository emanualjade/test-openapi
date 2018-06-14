'use strict'

const { capitalize } = require('underscore.string')

const {
  red,
  dim,
  orange,
  indent,
  indentValue,
  stringifyValue,
  highlightValue,
  HORIZONTAL_LINE,
} = require('../../utils')
const { getErrorProps } = require('../../error_props')

// Print task errors and update spinner
const complete = function({ options: { spinner }, ...task }, { plugins }) {
  const failed = task.error !== undefined

  spinner.update({ clear: failed })

  if (!failed) {
    return
  }

  const errorMessage = getErrorMessage({ task, plugins })
  return errorMessage
}

// Retrieve task's error to print
const getErrorMessage = function({
  task,
  task: {
    key,
    error: { message },
  },
  plugins,
}) {
  const { title, errorProps } = getErrorProps({ task, plugins })

  const errorPropsA = printErrorProps({ errorProps })

  return `
${HORIZONTAL_LINE}
${CROSS_MARK} ${red.bold(key)}

${dim(indent(title))}

${indent(message)}
${HORIZONTAL_LINE}

${indent(errorPropsA)}
`
}

// Red cross symbol
const CROSS_MARK = red.bold('\u2718')

// Print/prettify all `plugin.report()` return values
const printErrorProps = function({ errorProps }) {
  return Object.entries(errorProps)
    .map(printErrorProp)
    .join('\n\n')
}

// Print `error.*` properties in error printed message
const printErrorProp = function([name, value]) {
  // Stringify and prettify to YAML
  const string = stringifyValue(value)
  // Syntax highlighting, unless already highlighted
  const stringA = highlightValue(string)
  // Indentation if multiline
  const stringB = indentValue(stringA)
  // Prefix with `errorProp.name`
  return `${orange(`${capitalize(name, true)}:`)} ${stringB}`
}

module.exports = {
  complete,
}
