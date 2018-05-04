'use strict'

const { mapValues } = require('lodash')

// Returns minimal padding needed for each test property used in test titles
const getPaddings = function({ tests }) {
  return mapValues(PADDINGS, (_, name) => getPadding({ name, tests }))
}

const PADDINGS = { method: 0, path: 0 }

const getPadding = function({ name, tests }) {
  const values = tests.map(test => test[name].length)
  const padding = Math.max(...values)
  return padding
}

// `it()` title
const getTestTitle = function({ test, test: { specResStatus, name }, paddings }) {
  const [method, path] = addPaddings({ names: ['method', 'path'], test, paddings })
  return `${method} ${path} should respond with status code ${specResStatus} (${name})`
}

const addPaddings = function({ names, test, paddings }) {
  return names.map(name => addPadding({ name, test, paddings }))
}

const addPadding = function({ name, test, paddings }) {
  return test[name].padEnd(paddings[name])
}

module.exports = {
  getTestTitle,
  getPaddings,
}
