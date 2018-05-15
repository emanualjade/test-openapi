'use strict'

const { normalizeError } = require('./normalize')
const { keepFuncName } = require('./func_name')

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
const addErrorHandler = function(func, errorHandler = () => undefined) {
  return errorHandledFunc.bind(null, func, errorHandler)
}

const kAddErrorHandler = keepFuncName(addErrorHandler)

const errorHandledFunc = function(func, errorHandler, ...args) {
  try {
    const retVal = func(...args)

    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => errorHandler(error, ...args))
      : retVal
  } catch (error) {
    return errorHandler(error, ...args)
  }
}

// Add generic error handler that calls `normalizeError()`
const addGenErrorHandler = function(func, properties) {
  const errorHandler = genErrorHandler.bind(null, { properties })
  return kAddErrorHandler(func, errorHandler)
}

const genErrorHandler = function({ properties }, error, ...args) {
  const propertiesA = typeof properties === 'function' ? properties(...args) : properties
  throw normalizeError({ error, properties: propertiesA })
}

module.exports = {
  addErrorHandler: kAddErrorHandler,
  addGenErrorHandler,
}
