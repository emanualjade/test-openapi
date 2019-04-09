// Split a string into an array of strings according to delimiter `regExp`.
// Non-delimiters and delimiters are alternated.
// E.g. /-.-/g and 'abc-A-def-B-hij' return ['abc', '-A-', 'def', '-B-', 'hij']
// If no matches, returns `undefined`.
// `regExp` must have the `g` flag.
export const searchRegExp = function(regExp, string) {
  const delims = string.match(regExp)

  if (delims === null) {
    return
  }

  const matches = string.split(regExp)

  const tokens = matches.flatMap((match, index) =>
    interleaveDelims({ match, index, delims }),
  )

  // Non-delimiters are empty strings when delimiters are at the beginning or
  // the end, or when two delimiters follow each others.
  const tokensA = tokens.filter(token => token !== '')
  return tokensA
}

// Interleave delimiters and non-delimiters
const interleaveDelims = function({ match, index, delims }) {
  const delim = delims[index]

  // Last match
  if (delim === undefined) {
    return [match]
  }

  return [match, delim]
}
