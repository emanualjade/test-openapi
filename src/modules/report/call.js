'use strict'

const { stdout } = require('process')

// Call reporters' functions then write return value to output
const callReporters = async function(
  {
    startData: {
      report: { output, reporters, options },
    },
    type,
  },
  ...args
) {
  const promises = reporters.map(reporter =>
    callReporter({ reporter, output, options, type, args }),
  )
  await Promise.all(promises)
}

const callReporter = async function({
  reporter,
  reporter: { name },
  output,
  options,
  type,
  args: [arg, ...args],
}) {
  if (reporter[type] === undefined) {
    return
  }

  const optionsA = options[name] || {}
  const message = await reporter[type]({ ...arg, options: optionsA }, ...args)

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
