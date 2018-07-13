'use strict'

const { stdout } = require('process')
const { promisify } = require('util')

const { result } = require('../../utils')

// Call reporters' functions then write return value to output
const callReporters = async function({ reporters, type }, ...args) {
  const promises = reporters.map(reporter => callReporter({ reporter, type }, ...args))
  await Promise.all(promises)
}

const callReporter = async function(
  {
    reporter,
    reporter: {
      options,
      options: { output },
    },
    type,
  },
  ...args
) {
  if (reporter[type] === undefined) {
    return
  }

  const [arg, ...argsA] = args.map(arg => result(arg, { options }))

  const message = await reporter[type]({ ...arg, options }, ...argsA)

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
