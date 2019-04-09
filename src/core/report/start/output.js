import { stdout } from 'process'
import { createWriteStream } from 'fs'

import { TestOpenApiError, addErrorHandler } from '../../../errors.js'

// Where to output report according to `config.report.REPORTER.output`
export const normalizeOutput = async function({ options: { output }, reporter }) {
  // When `config.report.REPORTER.output` is `undefined` (default), write to
  // `stdout`
  if (output === undefined) {
    return stdout
  }

  // Otherwise write to a file
  const stream = await eGetFileStream({ output, reporter })
  return stream
}

const getFileStream = function({ output }) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(output)
    stream.on('open', resolve.bind(null, stream))
    stream.on('error', reject)
  })
}

const getFileStreamHandler = function(
  { message },
  { output, reporter: { name } },
) {
  throw new TestOpenApiError(
    `Could not write output to file '${output}': ${message}`,
    { property: `config.report.${name}.output`, value: output },
  )
}

const eGetFileStream = addErrorHandler(getFileStream, getFileStreamHandler)
