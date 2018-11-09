'use strict'

const deepMerge = require('deepmerge')

// We need a deep merge utility that:
//  - shallow merges arrays, i.e. `{ a: [1] }` + `{ a: [2] }` = `{ a: [2] }`
//  - do not skip `undefined`, i.e. `{ a: 1 }` + `{ a: undefined }` =
//   `{ a: undefined }`
//  - allow for customization, i.e. templates not being deep merged
const merge = function(...objects) {
  return deepMerge.all(objects, { arrayMerge })
}

// Allow customizing merge by adding a `func`
const customMerge = function(isMergeableObject, ...objects) {
  const filtered = objects.filter((obj) => {
    return obj != null
  })
  
  return deepMerge.all(objects, { arrayMerge, isMergeableObject })
}

// Shallow merge array
const arrayMerge = function(src, dest) {
  return dest
}

module.exports = {
  merge,
  customMerge,
}
