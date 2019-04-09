const { crawl } = require('../utils')

const {
  isJsonType,
  getMessage,
  UNDEFINED,
  ESCAPED_UNDEFINED,
} = require('./common')

// Applied on input config and tasks
const parseInput = function(taskOrConfig, throwError) {
  return crawl(
    taskOrConfig,
    (value, path) => parseInputValue({ value, path, throwError }),
    { topDown: true },
  )
}

const parseInputValue = function({ value, path, throwError }) {
  if (value === UNDEFINED) {
    return undefined
  }

  if (value === ESCAPED_UNDEFINED) {
    return UNDEFINED
  }

  if (isAllowed(value)) {
    return value
  }

  const message = getMessage({ value, path })
  throwError({ message, value, path })
}

const isAllowed = function(value) {
  return isJsonType(value) || value === undefined || typeof value === 'function'
}

module.exports = {
  parseInput,
}
