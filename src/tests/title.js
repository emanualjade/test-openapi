'use strict'

// `it()` title
const addTitles = function({ tests }) {
  const paddings = getPaddings({ tests })
  const testsA = tests.map(test => addTitle({ test, paddings }))
  return testsA
}

// Returns minimal padding needed for each test property used in test titles
const getPaddings = function({ tests }) {
  return PADDINGS.map(name => getPadding({ name, tests }))
}

const getPadding = function({ name, tests }) {
  const values = tests.map(({ operation }) => operation[name].length)
  const padding = Math.max(...values)
  return padding
}

const addTitle = function({ test, test: { name }, paddings }) {
  const [method, path] = addPaddings({ test, paddings })
  const title = `${method} ${path} (${name})`
  return { ...test, title }
}

const addPaddings = function({ test, paddings }) {
  return paddings.map((padding, index) => addPadding({ padding, test, index }))
}

const addPadding = function({ padding, test: { operation }, index }) {
  const name = PADDINGS[index]
  return operation[name].padEnd(padding)
}

const PADDINGS = ['method', 'path']

module.exports = {
  addTitles,
}
