'use strict'

const { set } = require('lodash/fp')

const { addErrorHandler, throwError } = require('../../../errors')

const { get } = require('./get')

// Set `dep` value to current task after it has been retrieved
const setRefs = function({ task, refs, depReturns }) {
  return refs.reduce((taskA, ref) => setRef({ task: taskA, ref, depReturns }), task)
}

const setRef = function({ task, ref: { depKey, depPath, path }, depReturns }) {
  const depReturn = depReturns[depKey]
  const depValue = eGetDepValue({ depKey, depReturn, depPath, path })

  const taskA = set(path, depValue, task)
  return taskA
}

const getDepValue = function({ depReturn, depPath }) {
  return get(depReturn, depPath)
}

// eslint-disable-next-line handle-callback-err
const getDepValueHandler = function(error, { depKey, depPath, path }) {
  const property = path.join('.')
  const expected = `${depKey}.${depPath}`
  throwError(`This task targets another task '${expected}' but this key could not be found`, {
    property,
    expected,
  })
}

const eGetDepValue = addErrorHandler(getDepValue, getDepValueHandler)

module.exports = {
  setRefs,
}
