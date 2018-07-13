'use strict'

const { stdout } = require('process')
const { createWriteStream } = require('fs')

const { TestOpenApiError, addErrorHandler } = require('../../../errors')

// Where to output report according to `config.report.REPORTER.output`
const normalizeOutput = async function({ options: { output }, reporter }) {
  // When `config.report.REPORTER.output` is `undefined` (default), write to `stdout`
  if (output === undefined) {
    return stdout
  }

  // Otherwise write to a file
  const stream = await eGetFileStream({ output, reporter })
  return stream
}

const getFileStream = function({ output }) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(output)
    stream.on('open', resolve.bind(null, stream))
    stream.on('error', reject)
  })
}

const getFileStreamHandler = function({ message }, { output, reporter: { name } }) {
  throw new TestOpenApiError(`Could not write output to file '${output}': ${message}`, {
    property: `report.${name}.output`,
    value: output,
  })
}

const eGetFileStream = addErrorHandler(getFileStream, getFileStreamHandler)

module.exports = {
  normalizeOutput,
}
