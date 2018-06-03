'use strict'

const { stdout } = require('process')

// Call reporters' functions then write return value to output
const callReporters = async function({
  config: {
    report: { output, reporters, options },
  },
  input,
  type,
}) {
  const promises = reporters.map(reporter =>
    callReporter({ reporter, output, input, options, type }),
  )
  await Promise.all(promises)
}

const callReporter = async function({
  reporter,
  reporter: { name },
  output,
  input,
  options,
  type,
}) {
  if (reporter[type] === undefined) {
    return
  }

  const optionsA = options[name] || {}
  const message = await reporter[type]({ ...input, options: optionsA })

  if (message !== undefined) {
    output.write(message)
  }

  if (type === 'end' && output !== stdout) {
    output.destroy()
  }
}

module.exports = {
  callReporters,
}
