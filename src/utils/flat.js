// Similar to JSON.stringify() except does not add double quotes around
// top-level strings
export const stringifyFlat = function(value) {
  if (value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}

// Inverse
export const parseFlat = function(value) {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
