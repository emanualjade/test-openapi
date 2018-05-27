'use strict'

const { set } = require('lodash/fp')

const { addErrorHandler, throwResponseError } = require('../../errors')
const { get } = require('../../utils')

const { runDeps } = require('./run')

// Replace all `deps`, i.e. references to other tasks.
const replaceDeps = async function(task, { runTask }) {
  if (task.dep.refs.length === 0) {
    return
  }

  const depReturns = await runDeps({ task, runTask })

  const taskA = setRefs({ task, depReturns })
  return taskA
}

const setRefs = function({
  task,
  task: {
    dep: { refs },
  },
  depReturns,
}) {
  return refs.reduce((taskA, ref) => setRef({ task: taskA, ref, depReturns }), task)
}

const setRef = function({ task, task: { config }, ref: { depKey, depPath, path }, depReturns }) {
  const depReturn = depReturns[depKey]
  const depValue = eGetDepValue({ depKey, depReturn, depPath, path, config })

  const taskA = set(path, depValue, task)
  return taskA
}

const getDepValue = function({ depReturn, depPath, config: { dry } }) {
  if (dry) {
    return
  }

  return get(depReturn, depPath)
}

// eslint-disable-next-line handle-callback-err
const getDepValueHandler = function(error, { depKey, depPath, path }) {
  const property = path.join('.')
  const expected = `${depKey}.${depPath}`
  throwResponseError(
    `This task targets another task '${expected}' but this key could not be found`,
    { property, expected },
  )
}

const eGetDepValue = addErrorHandler(getDepValue, getDepValueHandler)

module.exports = {
  replaceDeps,
}
