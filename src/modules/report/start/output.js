'use strict'

const { stdout } = require('process')
const { createWriteStream } = require('fs')

const { TestOpenApiError, addErrorHandler } = require('../../../errors')

// Add stream to write to, according to `config.tap.output`
const addOutput = async function({ config, config: { report } }) {
  const output = await getOutput({ config })
  return { ...report, output }
}

const getOutput = async function({
  config: {
    report: { output },
    tasks,
  },
}) {
  // When `config.tap.output` is `false`, silent output
  // When no tasks are run (e.g. all are skipped), it behaves like a dry run,
  // i.e. no reporting
  if (String(output) === 'false' || tasks.length === 0) {
    return false
  }

  // When `config.tap.output` is `true` (default), write to `stdout`
  if (String(output) === 'true') {
    return stdout
  }

  // When `config.tap.output` is a string, write to a file
  const stream = await eGetFileStream({ output })
  return stream
}

const getFileStream = function({ output }) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(output)
    stream.on('open', resolve.bind(null, stream))
    stream.on('error', reject)
  })
}

const getFileStreamHandler = function({ message }, { output }) {
  throw new TestOpenApiError(`Could not write output to file '${output}': ${message}`, {
    property: 'tap.output',
    actual: output,
  })
}

const eGetFileStream = addErrorHandler(getFileStream, getFileStreamHandler)

module.exports = {
  addOutput,
}
