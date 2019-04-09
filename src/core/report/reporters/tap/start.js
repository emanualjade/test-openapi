const serializer = require('./serializer')

// Start TAP v13 output
const start = function({ options: { tap } }) {
  return serializer.start(tap)
}

module.exports = {
  start,
}
