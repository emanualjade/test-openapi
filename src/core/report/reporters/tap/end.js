// eslint-disable-next-line import/no-namespace
import * as serializer from './serializer'

// Ends TAP v13 output
// Write # tests|pass|fail|skip|ok comments at the end
export const end = function(tasks, { options: { tap } }) {
  return serializer.end(tap)
}
