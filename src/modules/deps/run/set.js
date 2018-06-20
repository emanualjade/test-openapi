'use strict'

const { set } = require('lodash/fp')

const { TestOpenApiError } = require('../../../errors')

// Set `dep` value to current task after it has been retrieved
const setRefs = function({ task, refs, depReturns }) {
  return refs.reduce((taskA, ref) => setRef({ task: taskA, ref, depReturns }), task)
}

const setRef = function({ task, ref: { depKey, depPath, path }, depReturns }) {
  const depReturn = depReturns[depKey]
  const depValue = get({ obj: depReturn, path: depPath, depKey, propPath: path })

  const taskA = set(path, depValue, task)
  return taskA
}

// Like Lodash get() except works with objects that have keys with dots in them
const get = function({ obj, path, depKey, propPath }) {
  if (!path.includes('.') || obj[path] !== undefined) {
    return obj[path]
  }

  const keyA = Object.keys(obj).find(key => path.startsWith(`${key}.`))

  if (keyA === undefined) {
    throwGetError({ depKey, propPath, path })
  }

  const pathA = path.replace(`${keyA}.`, '')
  return get({ obj: obj[keyA], path: pathA, depKey, propPath })
}

const throwGetError = function({ depKey, propPath, path }) {
  const property = propPath.join('.')
  const value = `${depKey}.${path}`
  throw new TestOpenApiError(
    `This task targets another task '${value}' but this key could not be found`,
    { property, value },
  )
}

module.exports = {
  setRefs,
}
