'use strict'

// Like Array.reduce(), but supports async
const reduceAsync = function(array, mapFunc, prevVal, secondMapFunc) {
  return asyncReducer(prevVal, { array, mapFunc, secondMapFunc })
}

const asyncReducer = function(prevVal, input) {
  const { array, mapFunc, index = 0 } = input
  if (index === array.length) {
    return prevVal
  }

  const nextVal = mapFunc(prevVal, array[index], index, array)
  const inputA = { ...input, index: index + 1 }

  return promiseThen(nextVal, applySecondMap.bind(null, prevVal, inputA))
}

const applySecondMap = function(prevVal, input, nextVal) {
  if (input.secondMapFunc === undefined) {
    return asyncReducer(nextVal, input)
  }

  const nextValA = input.secondMapFunc(prevVal, nextVal)
  return asyncReducer(nextValA, input)
}

// Similar to `await retVal` and `Promise.resolve(retVal).then()`
// As opposed to them, this does not create a new promise callback if the
// return value is synchronous, i.e. it avoids unnecessary new microtasks
const promiseThen = function(retVal, func) {
  if (!retVal || typeof retVal.then !== 'function') {
    return func(retVal)
  }

  return retVal.then(func)
}

module.exports = {
  reduceAsync,
}
