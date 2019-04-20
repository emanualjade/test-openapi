import { start as serializerStart } from './serializer/main.js'

// Start TAP v13 output
export const start = function({ options: { tap } }) {
  return serializerStart(tap)
}
