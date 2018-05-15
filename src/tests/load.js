'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')

const fastGlob = require('fast-glob')
const { load: loadYaml, JSON_SCHEMA } = require('js-yaml')

const { addErrorHandler, throwTestError } = require('../errors')
const { isObject } = require('../utils')

// Load YAML/JSON test files
const loadTests = async function({ tests }) {
  // Can use globbing
  const testsA = await fastGlob(tests)

  const testsB = await Promise.all(testsA.map(loadTestFile))
  const testsC = Object.assign({}, ...testsB)

  return testsC
}

// Load and parse each test file in parallel
const loadTestFile = async function(path) {
  const content = await eReadFile(path)
  const tests = eParseTestFile({ path, content })

  validateTests({ tests, path })

  return tests
}

// File loading
const readFileHandler = function({ message }, path) {
  throwTestError(`Could not load test file '${path}': ${message}`)
}

const eReadFile = addErrorHandler(promisify(readFile), readFileHandler)

// YAML parsing
const parseTestFile = function({ path, content }) {
  return loadYaml(content, { ...YAML_OPTS, filename: path })
}

const YAML_OPTS = {
  schema: JSON_SCHEMA,
  json: true,
  onWarning(error) {
    throw error
  },
}

const parseTestFileHandler = function({ message }, { path }) {
  throwTestError(`Test file '${path}' is not valid YAML or JSON: ${message}`)
}

const eParseTestFile = addErrorHandler(parseTestFile, parseTestFileHandler)

const validateTests = function({ tests, path }) {
  if (isObject(tests)) {
    return
  }

  throwTestError(`Test file '${path}' should be an object not a ${typeof tests}`)
}

module.exports = {
  loadTests,
}
