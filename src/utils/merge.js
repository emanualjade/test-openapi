'use strict'

const { isDeepStrictEqual } = require('util')

// Merge array values with a custom merge function and condition function
const mergeValues = function(array, condition = isDeepStrictEqual, merge = defaultMerge) {
  return array.map(mergeValue.bind(null, merge, condition)).filter(value => value !== undefined)
}

const mergeValue = function(merge, condition, value, index, array) {
  const nextSameValue = findSameValue({ condition, array, value, start: index + 1 })

  if (nextSameValue !== undefined) {
    return
  }

  const prevSameValue = findSameValue({ condition, array, value, length: index })

  if (prevSameValue !== undefined) {
    return merge(prevSameValue, value)
  }

  return value
}

const findSameValue = function({ condition, array, value, start = 0, length }) {
  return array.slice(start, length).find(valueB => condition(value, valueB))
}

const defaultMerge = function(valueA, valueB) {
  return { ...valueA, ...valueB }
}

module.exports = {
  mergeValues,
}
