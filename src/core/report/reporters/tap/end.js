import { end as serializerEnd } from './serializer/main.js'

// Ends TAP v13 output
// Write # tests|pass|fail|skip|ok comments at the end
export const end = function(tasks, { options: { tap } }) {
  return serializerEnd(tap)
}
