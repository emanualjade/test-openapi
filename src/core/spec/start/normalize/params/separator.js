// Turn OpenAPI `collectionFormat` into `$$random` `x-separator`
export const addSeparator = function({ schema, collectionFormat }) {
  if (collectionFormat === undefined) {
    return schema
  }

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
