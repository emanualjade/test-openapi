'use strict'

const { mapValues } = require('lodash')

// `it()` title
const addTitles = function({ tests }) {
  const paddings = getPaddings({ tests })
  const testsA = tests.map(test => addTitle({ test, paddings }))
  return testsA
}

// Returns minimal padding needed for each test property used in test titles
const getPaddings = function({ tests }) {
  return mapValues(PADDINGS, (_, name) => getPadding({ name, tests }))
}

const PADDINGS = { method: 0, path: 0 }

const getPadding = function({ name, tests }) {
  const values = tests.map(({ operation }) => operation[name].length)
  const padding = Math.max(...values)
  return padding
}

const addTitle = function({ test, test: { name }, paddings }) {
  const [method, path] = addPaddings({ names: ['method', 'path'], test, paddings })
  const title = `${method} ${path} (${name})`
  return { ...test, title }
}

const addPaddings = function({ names, test, paddings }) {
  return names.map(name => addPadding({ name, test, paddings }))
}

const addPadding = function({ name, test: { operation }, paddings }) {
  return operation[name].padEnd(paddings[name])
}

module.exports = {
  addTitles,
}
