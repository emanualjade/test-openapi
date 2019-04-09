// eslint-disable-next-line import/no-namespace
import * as serializer from './serializer.js'

// Start TAP v13 output
const start = function({ options: { tap } }) {
  return serializer.start(tap)
}

module.exports = {
  start,
}
