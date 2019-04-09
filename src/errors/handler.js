import keepFuncProps from 'keep-func-props'

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
// eslint-disable-next-line no-empty-function
const addErrorHandler = function(func, errorHandler = () => {}) {
  return errorHandledFunc.bind(null, func, errorHandler)
}

const kAddErrorHandler = keepFuncProps(addErrorHandler)
export { kAddErrorHandler as addErrorHandler }

const errorHandledFunc = function(func, errorHandler, ...args) {
  try {
    const retVal = func(...args)

    // Works for async functions as well
    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => handleError({ func, errorHandler, error, args }))
      : retVal
  } catch (error) {
    return handleError({ func, errorHandler, error, args })
  }
}

const handleError = function({ func, errorHandler, error, args }) {
  const errorA = normalizeError(func, error)
  return errorHandler(errorA, ...args)
}

// Make sure thrown objects are Errors
const normalizeError = function(func, error) {
  if (error instanceof Error) {
    return error
  }

  const errorA = new Error(error)

  addStack(errorA)

  return errorA
}

// Remove error handling logic from stack trace
const addStack = function(error) {
  const obj = {}
  Error.captureStackTrace(obj, errorHandledFunc)
  const { stack } = obj

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.stack = stack
}
