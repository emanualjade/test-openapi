// Make it work with `Object.create(null)`
// eslint-disable-next-line no-shadow
const { propertyIsEnumerable } = Object.prototype

// Like Lodash.get() except takes into account objects whose properties
// have dots
// E.g. _.get({ a: { 'b.c': true } }, 'a.b.c') does not work
export const get = function(value, path) {
  const pathA = removeBrackets({ path })
  return getProperty(value, pathA)
}

const getProperty = function(value, path) {
  // We can only follow `path` within objects and arrays
  if (!isComplex(value)) {
    return
  }

  // When we reached the final property
  if (propertyIsEnumerable.call(value, path)) {
    return value[path]
  }

  // Find the next property
  const property = Object.keys(value)
    .filter(key => path.startsWith(`${key}.`))
    .reduce(getLargestString, '')

  // When `path` does not match anything in `value`
  if (property === '') {
    return
  }

  // Recursion
  const child = value[property]
  const childPath = path.replace(`${property}.`, '')
  return getProperty(child, childPath)
}

const isComplex = function(value) {
  return typeof value === 'object' && value !== null
}

// If several keys match, take the largest one
const getLargestString = function(memo, string) {
  if (string.length >= memo.length) {
    return string
  }

  return memo
}

// Similar to `get()` but using the longest path that does not
// return `undefined`.
// Also set the parent path as a top-level property.
export const tryGet = function(value, path) {
  const pathA = splitPath({ path })

  // Find longest path that does not return `undefined`
  const wrongIndex = pathA.findIndex((valueA, index) =>
    isWrongPath({ path: pathA, value, index }),
  )

  // If the first path part already returns `undefined`, return top-value value
  // as is
  if (wrongIndex === 0) {
    return { wrongPath: pathA[0], value }
  }

  const wrongPath = getWrongPath({ path: pathA, index: wrongIndex })

  const parentPath = getParentPath({ path: pathA, index: wrongIndex })
  const childValue = get(value, parentPath)
  const valueB = { [parentPath]: childValue }

  return { wrongPath, value: valueB }
}

const splitPath = function({ path }) {
  const pathA = removeBrackets({ path })
  const pathB = pathA.split('.')
  return pathB
}

const isWrongPath = function({ path, value, index }) {
  const pathB = path.slice(0, index + 1).join('.')
  return get(value, pathB) === undefined
}

const getWrongPath = function({ path, index }) {
  // When no value returned `undefined`
  if (index === -1) {
    return
  }

  return path.slice(0, index + 1).join('.')
}

const getParentPath = function({ path, index }) {
  if (index === -1) {
    return path.join('.')
  }

  return path.slice(0, index).join('.')
}

// Allow array bracket notations `[integer]` by replacing them to dots
const removeBrackets = function({ path }) {
  return path.replace(BRACKETS_REGEXP, '.$1').replace(/^\./u, '')
}

const BRACKETS_REGEXP = /\[([\d]+)\]/gu
