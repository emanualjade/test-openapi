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
  const inputA = { ...input, options }

  const promises = reporters.map(reporter =>
    callReporter({ reporter, output, input: inputA, type }),
  )
  await Promise.all(promises)
}

const callReporter = async function({ reporter, output, input, type }) {
  if (reporter[type] === undefined) {
    return
  }

  const message = await reporter[type](input)

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
