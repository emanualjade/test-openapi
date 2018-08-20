'use strict'

// Check RegExp string against a value.
// Can be an array for alternatives.
const testRegExp = function(regExp, value) {
  if (Array.isArray(regExp)) {
    return regExp.some(regExpA => testRegExp(regExpA, value))
  }

  // Always matched case-insensitively
  const regExpA = new RegExp(regExp, 'i')
  return regExpA.test(value)
}

module.exports = {
  testRegExp,
}
