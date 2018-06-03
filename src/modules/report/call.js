'use strict'

const { stdout } = require('process')

// Setup reporter's options
const getReporterOptions = function({
  config,
  config: {
    report: { output, reporter, options },
  },
}) {
  if (output === false || reporter.options === undefined) {
    return options
  }

  const optionsA = reporter.options({ config, options })
  return { ...options, ...optionsA }
}

// Call reporter's function then write return value to output
const callReporter = async function({
  config: {
    report: { output, reporter, options },
  },
  input,
  type,
}) {
  if (output === false || reporter[type] === undefined) {
    return
  }

  const message = await reporter[type]({ ...input, options })

  if (message !== undefined) {
    output.write(message)
  }

  if (type === 'end' && output !== stdout) {
    output.destroy()
  }
}

module.exports = {
  getReporterOptions,
  callReporter,
}
