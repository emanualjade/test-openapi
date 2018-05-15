'use strict'

const { set } = require('lodash/fp')

const { addErrorHandler, throwResponseError } = require('../errors')
const { get } = require('../utils')

const { runDeps } = require('./run')

// Replace all `deps`, i.e. references to other tests.
const replaceDeps = async function({ test, test: { deps }, opts, runTest }) {
  if (deps.length === 0) {
    return test
  }

  const depReturns = await runDeps({ test, deps, opts, runTest })

  const testA = setDeps({ test, deps, depReturns, opts })
  return testA
}

const setDeps = function({ test, deps, depReturns, opts }) {
  return deps.reduce((testA, dep) => setDep({ test, dep, depReturns, opts }), test)
}

const setDep = function({
  test,
  test: { testOpts },
  dep: { depKey, depPath, path },
  depReturns,
  opts,
}) {
  const depReturn = depReturns[depKey]
  const depValue = eGetDepValue({ depKey, depReturn, depPath, path, opts })

  const testOptsA = set(path, depValue, testOpts)
  return { ...test, testOpts: testOptsA }
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

module.exports = {
  replaceDeps,
}
