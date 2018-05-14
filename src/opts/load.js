'use strict'

const { loadNormalizedSpec } = require('../spec')
const { loadTests, normalizeTests } = require('../tests')

const { getServer } = require('./server')

// Load and normalize options
const loadOpts = async function({
  spec,
  tests = DEFAULT_TESTS,
  server,
  repeat = DEFAULT_REPEAT,
  timeout = DEFAULT_TIMEOUT,
  maxParallel = DEFAULT_MAX_PARALLEL,
}) {
  // Retrieve OpenAPI specification
  const specA = loadNormalizedSpec({ path: spec })

  // Retrieve test files
  const testsA = loadTests({ tests })

  // Parallelize for performance reasons
  const [specB, testsB] = await Promise.all([specA, testsA])

  // Normalize tests, e.g. match test with specification's operation
  const testsC = normalizeTests({ tests: testsB, spec: specB })

  // Retrieve HTTP request's base URL
  const serverA = getServer({ server, spec: specB })

  return { spec: specB, tests: testsC, server: serverA, repeat, timeout, maxParallel }
}

const DEFAULT_TESTS = ['**/*.test.yml', '**/*.spec.yml', '**/*.test.json', '**/*.test.yml']
// Number of times each `it()` is repeated (each time with new random parameters)
const DEFAULT_REPEAT = 1e1
// Timeout for both:
//  - sending and receiving each HTTP request
//  - parsing the HTTP response
// I.e. this is the timeout for a single test, but excluding the time its `deps` take
const DEFAULT_TIMEOUT = 1e4
// Number of concurrent HTTP requests at once
// I.e. number of parallel `it()` will be `maxParallel` / `repeat`
const DEFAULT_MAX_PARALLEL = 1e2

module.exports = {
  loadOpts,
}
