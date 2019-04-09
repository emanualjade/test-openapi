// Similar to `await retVal` and `Promise.resolve(retVal).then()`
// As opposed to them, this does not create a new promise callback if the
// return value is synchronous, i.e. it avoids unnecessary new microtasks
const promiseThen = function(retVal, func) {
  if (!isPromise(retVal)) {
    return func(retVal)
  }

  // eslint-disable-next-line promise/prefer-await-to-then
  return retVal.then(func)
}

// Similar to `await Promise.all([...retVals])` or
// `Promise.all([...retVals]).then()`
// As opposed to them, this does not create a new promise callback if the
// return value is synchronous, i.e. it avoids unnecessary new microtasks
const promiseAllThen = function(retVals, func) {
  const retValsA = promiseAll(retVals)
  return promiseThen(retValsA, func)
}

const promiseAll = function(retVals) {
  if (!retVals.some(isPromise)) {
    return retVals
  }

  return Promise.all(retVals)
}

const isPromise = function(retVal) {
  // eslint-disable-next-line promise/prefer-await-to-then
  return retVal && typeof retVal.then === 'function'
}

module.exports = {
  promiseThen,
  promiseAllThen,
  promiseAll,
}
