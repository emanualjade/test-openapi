'use strict'

const Parser = require('tap-parser')

// JSON/YAML reporter
const report = function(options, stream) {
  const parser = new Parser({ strict: true, passes: true })

  parser.on('complete', printResults.bind(null, stream))

  return parser
}

const printResults = function(stream, results) {
  const resultsA = getResults({ results })
  stream.write(resultsA)
}

const getResults = function({ results }) {
  return JSON.stringify(results, null, 2)
}

module.exports = {
  report,
}
