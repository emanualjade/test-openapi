'use strict'

const { omitBy } = require('lodash')

const { loadNormalizedSpec } = require('../spec')
const { loadTests, normalizeTests } = require('../tests')

const { validateOpts } = require('./validate')
const DEFAULT_OPTS = require('./defaults')
const { getServer } = require('./server')

// Load and normalize options
const loadOpts = async function({ opts }) {
  validateOpts({ opts })

  const optsA = addDefaults({ opts })

  const { spec, tests, server } = optsA

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

  return { ...optsA, spec: specB, tests: testsC, server: serverA }
}

// Apply default values
const addDefaults = function({ opts }) {
  const optsA = omitBy(opts, value => value === undefined)
  const optsB = { ...DEFAULT_OPTS, ...optsA }
  return optsB
}

module.exports = {
  loadOpts,
}
