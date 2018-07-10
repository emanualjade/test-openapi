'use strict'

// Find common prefix on a list of strings
const findCommonPrefix = function(strings) {
  const stringsA = strings.filter(string => typeof string === 'string')

  if (stringsA.length === 0) {
    return ''
  }

  const [first, ...stringsB] = stringsA

  const commonLengthA = stringsB.reduce((commonLength, string) => {
    const indexes = new Array(commonLength).fill().map((value, index) => index)
    const newCommonLength = indexes.find(index => string[index] !== first[index])
    return newCommonLength === undefined ? commonLength : newCommonLength
  }, first.length)

  const commonPrefix = first.slice(0, commonLengthA)
  return commonPrefix
}

module.exports = {
  findCommonPrefix,
}
