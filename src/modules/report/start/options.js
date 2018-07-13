'use strict'

const { checkSchema } = require('../../../validation')
const { isSilent, normalizeLevel } = require('../level')

const COMMON_OPTIONS_SCHEMA = require('./common_options_schema')
const { normalizeOutput } = require('./output')

// Add `config.report.REPORTER.*` as `reporter.options`
const addOptions = async function({ reporters, config }) {
  const promises = reporters.map(reporter => addReporterOptions({ reporter, config }))
  const reportersA = await Promise.all(promises)

  const reportersB = reportersA.filter(reporter => reporter !== undefined)
  return reportersB
}

const addReporterOptions = async function({ reporter, config }) {
  const options = getOptions({ reporter, config })

  validateOptions({ reporter, options })

  const optionsA = await normalizeOptions({ options, reporter })

  // Filter out reporters with `config.report.REPORTER.level` `silent`
  if (isSilent({ options: optionsA })) {
    return
  }

  const optionsB = transformOptions({ reporter, options: optionsA, config })

  return { ...reporter, options: optionsB }
}

// Retrieve `config.report.REPORTER.*`
const getOptions = function({
  reporter: { name },
  config: { report: { [name]: options = {} } = {} },
}) {
  // Can use `true`, to make it CLI options-friendly
  if (options === true) {
    return {}
  }

  return options
}

// Validate `config.report.REPORTER.*` against `reporter.config`
const validateOptions = function({ reporter, reporter: { name }, options }) {
  const schema = getOptionsSchema({ reporter })

  checkSchema({
    schema,
    value: options,
    name: `report.${name}`,
    message: `'report.${name}'`,
    props: { plugin: `reporter-${name}` },
  })
}

const getOptionsSchema = function({ reporter: { config } }) {
  const properties = { ...COMMON_OPTIONS_SCHEMA, ...config }
  return { type: 'object', properties, additionalProperties: false }
}

// Normalize `config.report.REPORTER.level|output` and set to `reporter.options.level|output`
const normalizeOptions = async function({ options, reporter }) {
  const level = normalizeLevel({ options, reporter })

  const output = await normalizeOutput({ options, reporter })

  return { ...options, level, output }
}

// Transform options using `reporter.options()`
// This can only add new options not transform existing ones.
// In particular, it cannot change `level|output` as `level` needs to be used
// before this point (when checking whether level is `silent`)
const transformOptions = function({ reporter: { options: reporterOptions }, options, config }) {
  if (reporterOptions === undefined) {
    return options
  }

  const optionsA = reporterOptions({ options, config })
  return { ...optionsA, ...options }
}

module.exports = {
  addOptions,
}
