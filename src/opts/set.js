'use strict'

const { getServer } = require('./server')

// Test files are `require()`'d by Jasmine.
// So we need to pass information to them by setting global variables
const setOpts = async function(opts) {
  global[Symbol.for('integration')] = opts
}

const unsetOpts = function() {
  delete global[Symbol.for('integration')]
}

// Main options are passed as environment variables because a new process is spawn
const getOpts = function() {
  const {
    [Symbol.for('integration')]: {
      spec,
      server,
      tests,
      // Number of times each `it()` is repeated (each time with new random parameters)
      repeat = DEFAULT_REPEAT,
      // Number of concurrent HTTP requests at once
      // I.e. number of parallel `it()` will be `maxParallel` / `repeat`
      maxParallel = DEFAULT_MAX_PARALLEL,
    },
  } = global

  // `it()` timeout must be high because it might wait for parallel tests
  const timeout = maxParallel * TIMEOUT_PER_TEST

  // Retrieve HTTP request's base URL
  const serverA = getServer({ server, spec })

  return { spec, server: serverA, tests, repeat, timeout }
}

const DEFAULT_REPEAT = 1e1
const DEFAULT_MAX_PARALLEL = 1e2
const TIMEOUT_PER_TEST = 1e3

module.exports = {
  setOpts,
  unsetOpts,
  getOpts,
}
