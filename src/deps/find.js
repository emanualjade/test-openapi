'use strict'

const { uniq } = require('lodash')

const { crawl } = require('../utils')

// Find all `deps`, i.e. references to other tests as `operationId.testName.request|response.*`
const findDeps = function({ testOpts, testKeys }) {
  const nodes = crawl(testOpts)
  const deps = nodes.map(node => parseDep({ node, testKeys })).filter(dep => dep !== undefined)
  const depKeys = getDepKeys({ deps })
  return { deps, depKeys }
}

// Return each `dep` as an object with:
//   depKey: 'operationId.testName'
//   depPath: 'request|response...'
//   path: 'request|response...'
const parseDep = function({ node: { value, path }, testKeys }) {
  if (typeof value !== 'string') {
    return
  }

  const depKey = testKeys.find(testKey => value.startsWith(`${testKey}.`))
  if (depKey === undefined) {
    return
  }

  const depPath = value.replace(`${depKey}.`, '')

  const pathA = path.join('.')

  return { depKey, depPath, path: pathA }
}

// Returns unique set of `deps` for current test
const getDepKeys = function({ deps }) {
  const depKeys = Object.values(deps).map(({ depKey }) => depKey)
  const depKeysA = uniq(depKeys)
  return depKeysA
}

module.exports = {
  findDeps,
}
