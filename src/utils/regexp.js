// Check RegExp string against a value.
// Can be an array for alternatives.
export const testRegExp = function(regExp, value) {
  if (Array.isArray(regExp)) {
    return regExp.some(regExpA => testRegExp(regExpA, value))
  }

  // Always matched case-insensitively
  const regExpB = new RegExp(regExp, 'iu')
  return regExpB.test(value)
}
