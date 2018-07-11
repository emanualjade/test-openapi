'use strict'

const { stdout } = require('process')
const { promisify } = require('util')

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

  if (type === 'end') {
    await endReporting({ output })
  }
}

const endReporting = async function({ output }) {
  // Give enough time for `output` stream to be flushed
  await promisify(setTimeout)()

  if (output === stdout) {
    return
  }

  output.destroy()
}

module.exports = {
  callReporters,
}
