const { getColors } = require('./colors')

// Create new state object
const init = function({ count, colors } = {}) {
  const colorsA = getColors({ colors })

  return { ...DEFAULT_STATE, count, colors: colorsA }
}

const DEFAULT_STATE = { index: 0, pass: 0, fail: 0, skip: 0 }

module.exports = {
  init,
}
