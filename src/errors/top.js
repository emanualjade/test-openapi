import { handleBugs } from './bug.js'

// Add `error.config` and `error.errors` to every error
// Also mark exceptions that are probably bugs as such
export const topLevelHandler = function(error, config) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.config = config

  const errorA = handleBugs({ error })
  throw errorA
}
