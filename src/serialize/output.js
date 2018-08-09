'use strict'

const { crawl } = require('../utils')

const { convertTaskError } = require('./error')
const { addSerializeFail } = require('./fail')
const { isJsonType, getMessage, UNDEFINED, ESCAPED_UNDEFINED } = require('./common')

// Applied on tasks output, i.e. what is reported and returned
const serializeOutput = function({ task, plugins }) {
  const taskA = convertTaskError({ task })

  // We use a `state` object because `crawl` utility does not allow returning both
  // the crawled object and extra information
  const state = {}

  const taskB = crawl(taskA, (value, path) => serializeOutputValue({ value, path, state }), {
    topDown: true,
  })

  const { error } = state
  const taskC = addSerializeFail({ task: taskB, error, plugins })
  return taskC
}

const serializeOutputValue = function({ value, path, state }) {
  if (value === undefined) {
    return UNDEFINED
  }

  if (value === UNDEFINED) {
    return ESCAPED_UNDEFINED
  }

  if (isJsonType(value)) {
    return value
  }

  if (typeof value === 'function') {
    return serializeFunction(value)
  }

  // If the value cannot be serialized, returns the first one as `error`.
  // Serialize that value to `undefined`
  const message = getMessage({ value, path })
  state.error = { message, value, path }
}

const serializeFunction = function({ name }) {
  const nameA = name || DEFAULT_FUNC_NAME
  return `function ${nameA}()`
}

const DEFAULT_FUNC_NAME = 'anonymous'

module.exports = {
  serializeOutput,
}
