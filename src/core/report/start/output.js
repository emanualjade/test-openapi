import { stdout } from 'process'
import { createWriteStream } from 'fs'

import { TestOpenApiError } from '../../../errors/error.js'

// Where to output report according to `config.report.REPORTER.output`
export const normalizeOutput = async function({
  options: { output },
  reporter: { name },
}) {
  // When `config.report.REPORTER.output` is `undefined` (default), write to
  // `stdout`
  if (output === undefined) {
    return stdout
  }

  // Otherwise write to a file
  try {
    return await getFileStream(output)
  } catch (error) {
    throw new TestOpenApiError(
      `Could not write output to file '${output}': ${error.message}`,
      { property: `config.report.${name}.output`, value: output },
    )
  }
}

const getFileStream = function(output) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(output)
    stream.on('open', resolve.bind(null, stream))
    stream.on('error', reject)
  })
}
