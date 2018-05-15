'use strict'

const { set, merge } = require('lodash')

const { addErrorHandler, throwResponseError } = require('../errors')
const { get } = require('../utils')

const { runDeps } = require('./run')

// Replace all `deps`, i.e. references to other tests.
const replaceDeps = async function({ test, test: { deps }, opts, runTest }) {
  if (deps.length === 0) {
    return test
  }

  const depReturns = await runDeps({ test, deps, opts, runTest })
  const depsA = deps.map(dep => replaceDep({ dep, depReturns }))
  const testA = mergeDeps({ test, deps: depsA })
  return testA
}

const replaceDep = function({ dep: { depKey, depPath, path }, depReturns }) {
  const depReturn = depReturns[depKey]
  const depValue = eGetDepValue({ depKey, depReturn, depPath, path })
  const depValueA = set({}, path, depValue)
  return depValueA
}

const getDepValue = function({ depReturn, depPath }) {
  return get(depReturn, depPath)
}

// eslint-disable-next-line handle-callback-err
const getDepValueHandler = function(error, { depKey, depPath, path }) {
  const property = path.join('.')
  const expected = `${depKey}.${depPath}`
  throwResponseError(
    `This test targets another test '${expected}' but this key could not be found`,
    { property, expected },
  )
}

const eGetDepValue = addErrorHandler(getDepValue, getDepValueHandler)

const mergeDeps = function({ test, test: { testOpts }, deps }) {
  const testOptsA = merge({}, testOpts, ...deps)
  return { ...test, testOpts: testOptsA }
}

module.exports = {
  replaceDeps,
}
