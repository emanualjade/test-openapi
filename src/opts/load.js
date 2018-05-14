'use strict'

const { loadNormalizedSpec } = require('../spec')
const { loadTests } = require('../tests')
const { getServer } = require('./server')

// Load and normalize options
const loadOpts = async function({
  spec,
  tests = DEFAULT_TESTS,
  repeat = DEFAULT_REPEAT,
  maxParallel = DEFAULT_MAX_PARALLEL,
  server,
}) {
  // Retrieve OpenAPI specification
  const specA = await loadNormalizedSpec({ path: spec })

  // Retrieve test files
  const testsA = await loadTests({ tests, spec: specA })

  // `it()` timeout must be high because it might wait for parallel tests
  const timeout = maxParallel * TIMEOUT_PER_TEST

  // Retrieve HTTP request's base URL
  const serverA = getServer({ server, spec: specA })

  return { spec: specA, tests: testsA, server: serverA, repeat, timeout }
}

const DEFAULT_TESTS = ['**/*.test.yml', '**/*.spec.yml', '**/*.test.json', '**/*.test.yml']
// Number of times each `it()` is repeated (each time with new random parameters)
const DEFAULT_REPEAT = 1e1
// Number of concurrent HTTP requests at once
// I.e. number of parallel `it()` will be `maxParallel` / `repeat`
const DEFAULT_MAX_PARALLEL = 1e2
const TIMEOUT_PER_TEST = 1e3

module.exports = {
  loadOpts,
}
