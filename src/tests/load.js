'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')

const fastGlob = require('fast-glob')
const { load: loadYaml, JSON_SCHEMA } = require('js-yaml')

const { addErrorHandler } = require('../errors')

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
  return tests
}

// File loading
const readFileHandler = function({ message }, path) {
  // type: test
  throw new Error(`Could not load test file '${path}': ${message}`)
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
  // type: test
  throw new Error(`Test file '${path}' is not valid YAML or JSON: ${message}`)
}

const eParseTestFile = addErrorHandler(parseTestFile, parseTestFileHandler)

module.exports = {
  loadTests,
}
