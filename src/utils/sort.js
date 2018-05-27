'use strict'

// Like array.sort() but does not mutate argument
const sortArray = function(array, func) {
  return [...array].sort(func)
}

const sortBy = function(array, prop) {
  return sortArray(array, sortByFunc.bind(null, prop))
}

const sortByFunc = function(prop, objA, objB) {
  if (objA[prop] < objB[prop]) {
    return -1
  }

  if (objA[prop] > objB[prop]) {
    return 1
  }

  return 0
}

module.exports = {
  sortArray,
  sortBy,
}
