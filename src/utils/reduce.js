import { promiseThen } from './promise.js'

// Like Array.reduce(), but supports async
export const reduceAsync = function(
  array,
  mapFunc,
  { prevVal, secondMapFunc, stopFunc },
) {
  return asyncReducer(prevVal, { array, mapFunc, secondMapFunc, stopFunc })
}

const asyncReducer = function(prevVal, input) {
  const { array, mapFunc, stopFunc, index = 0 } = input

  if (index === array.length) {
    return prevVal
  }

  if (stopFunc !== undefined && stopFunc(prevVal)) {
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
