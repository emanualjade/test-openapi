'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')

const fastGlob = require('fast-glob')
const { load: loadYaml, JSON_SCHEMA } = require('js-yaml')

// Load YAML/JSON test files
const loadTestFiles = async function({ tests = [] }) {
  // Can use globbing
  const testsA = await fastGlob(tests)

  const testsB = await Promise.all(testsA.map(loadTestFile))
  const testsC = Object.assign({}, ...testsB)

  validateTests({ tests: testsC })

  return testsC
}

// Load and parse each test file in parallel
const loadTestFile = async function(path) {
  const content = await loadTestFileContent({ path })
  const tests = parseTestFile({ path, content })
  return tests
}

const loadTestFileContent = async function({ path }) {
  try {
    return await promisify(readFile)(path)
  } catch (message) {
    throw new Error(`Could not load test file '${path}': ${message}`)
  }
}

const parseTestFile = function({ path, content }) {
  try {
    return loadYaml(content, { ...YAML_OPTS, filename: path })
  } catch (message) {
    throw new Error(`Test file '${path}' is not valid YAML or JSON: ${message}`)
  }
}

const YAML_OPTS = {
  schema: JSON_SCHEMA,
  json: true,
  onWarning(error) {
    throw error
  },
}

const validateTests = function({ tests }) {
  if (Object.keys(tests).length === 0) {
    throw new Error('No tests were found')
  }
}

module.exports = {
  loadTestFiles,
}
