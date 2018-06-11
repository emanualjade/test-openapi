'use strict'

// Turn OpenAPI `collectionFormat` into `task.random.*.x-separator`
const addSeparator = function({ schema, collectionFormat = 'csv' }) {
  const separator = COLLECTION_FORMATS[collectionFormat]
  return { ...schema, 'x-separator': separator }
}

const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
  // This is using a special notation, see the code that handles query
  multi: '&=',
}

module.exports = {
  addSeparator,
}
