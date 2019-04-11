// eslint-disable-next-line import/no-namespace
import * as serializer from './serializer'

// Start TAP v13 output
export const start = function({ options: { tap } }) {
  return serializer.start(tap)
}
