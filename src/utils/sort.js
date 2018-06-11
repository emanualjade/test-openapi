'use strict'

// Like array.sort() but does not mutate argument
const sortArray = function(array, func) {
  return [...array].sort(func)
}

module.exports = {
  sortArray,
}
