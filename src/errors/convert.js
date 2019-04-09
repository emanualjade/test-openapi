import { isBugError } from './bug.js'

// Must do this to convert to plain object while keeping non-enumerable
// properties `error.name|message|stack`
export const convertPlainObject = function({ name, message, stack, ...error }) {
  // We only need `error.stack` when it's a bug error
  if (isBugError({ name })) {
    return { ...error, name, message, stack }
  }

  return { ...error, name, message }
}
