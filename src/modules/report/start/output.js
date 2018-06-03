'use strict'

const { stdout } = require('process')
const { createWriteStream } = require('fs')

const { TestOpenApiError, addErrorHandler } = require('../../../errors')

// Retrieves stream to write to, according to `config.tap.output`
const getOutput = async function({ report: { output } }) {
  // When `config.tap.output` is `true` (default), write to `stdout`
  if (output === true) {
    return stdout
  }

  // When `config.tap.output` is `false`, silent output
  if (output === false) {
    return false
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
  getOutput,
}
