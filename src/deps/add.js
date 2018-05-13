'use strict'

const { crawl } = require('../utils')

// Add all `deps`, i.e. references to other tests as `operationId.testName.request|response.*`
const addDeps = function({ tests }) {
  return tests.map(test => addTestDeps({ test, tests }))
}

const addTestDeps = function({ test, test: { testOpts }, tests }) {
  const nodes = crawl(testOpts)
  const deps = nodes.map(node => parseDep({ node, tests })).filter(dep => dep !== undefined)
  return { ...test, deps }
}

// Return each `dep` as an object with:
//   depKey: 'operationId.testName'
//   depPath: 'request|response...'
//   path: 'request|response...'
const parseDep = function({ node: { value, path }, tests }) {
  if (typeof value !== 'string') {
    return
  }

  const depKey = tests
    .map(({ testKey }) => testKey)
    .find(testKey => value.startsWith(`${testKey}.`))
  if (depKey === undefined) {
    return
  }

  const depPath = value.replace(`${depKey}.`, '').replace(BRACKETS_TO_DOTS, '.$1')

  return { depKey, depPath, path }
}

// Converts `a.b[0].c` to `a.b.0.c`
const BRACKETS_TO_DOTS = /\[([0-9]+)\]/g

module.exports = {
  addDeps,
}
