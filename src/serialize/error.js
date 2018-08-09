'use strict'

const { convertPlainObject } = require('../errors')

// Convert errors to plain objects
const convertTaskError = function({ task, task: { error } }) {
  if (error === undefined) {
    return task
  }

  const errorA = convertError({ error })
  return { ...task, error: errorA }
}

const convertError = function({ error, error: { nested, nested: { error: nestedError } = {} } }) {
  const errorA = convertPlainObject(error)

  if (nestedError === undefined) {
    return errorA
  }

  const nestedErrorA = convertError({ error: nestedError })
  return { ...errorA, nested: { ...nested, error: nestedErrorA } }
}

module.exports = {
  convertTaskError,
}
