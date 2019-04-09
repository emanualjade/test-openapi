// Similar to JSON.stringify() except does not add double quotes around
// top-level strings
const stringifyFlat = function(value) {
  if (value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}

// Inverse
const parseFlat = function(value) {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

module.exports = {
  stringifyFlat,
  parseFlat,
}
