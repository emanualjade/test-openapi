'use strict'

const { capitalize } = require('underscore.string')

const { getPath } = require('../utils')
const { convertPlainObject, BugError } = require('../errors')

// If a value in `task.*` could not be serialized, we add it as `task.error`
// so it gets properly reported (as opposed to throwing an error)
const addSerializeFail = function({ task, error, plugins }) {
  if (error === undefined) {
    return task
  }

  const errorA = getSerializeFail({ error, plugins })
  const errorB = convertPlainObject(errorA)

  return { ...task, error: errorB }
}

const getSerializeFail = function({ error: { message, value, path }, plugins }) {
  const messageA = capitalize(message)
  // Make sure `error.value` is serializable
  const valueA = String(value)
  const property = getPath(['task', ...path])
  const module = guessModule({ path, plugins })

  const error = new BugError(messageA, { value: valueA, property, module })
  return error
}

// Try to guess `error.module` from where the value was in task.*
// This is not error-proof since plugins can modify input of other plugins.
const guessModule = function({ path: [name], plugins }) {
  const plugin = plugins.find(({ name: nameA }) => nameA === name)
  if (plugin === undefined) {
    return
  }

  return `plugin-${name}`
}

module.exports = {
  addSerializeFail,
}
