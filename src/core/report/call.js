import { stdout } from 'process'
import { promisify } from 'util'

import { result } from '../../utils/result.js'

// Call reporters' functions then write return value to output
export const callReporters = async function({ reporters, type }, ...args) {
  const promises = reporters.map(reporter =>
    callReporter({ reporter, type }, ...args),
  )
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

  const argsA = getArgs({ args, options })

  const message = await reporter[type](...argsA)

  if (message !== undefined) {
    output.write(message)
  }

  if (type === 'end') {
    await endReporting({ output })
  }
}

const getArgs = function({ args, options }) {
  const [argA, context] = args.map(arg => result(arg, { options }))
  const argsA = [argA, { ...context, options }].filter(
    argB => argB !== undefined,
  )
  return argsA
}

const endReporting = async function({ output }) {
  // Give enough time for `output` stream to be flushed
  await promisify(setTimeout)()

  if (output === stdout) {
    return
  }

  output.destroy()
}
