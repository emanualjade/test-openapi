'use strict'

const { mergeHeaders, deepMerge } = require('../../../utils')

// `validate.schemaByStatus` is like `validate.schemas` but as map according to
// status code.
// Used e.g. with OpenAPI specification which allow different responses per status.
const pickSchemaByStatus = function({
  validate: { schemas, schemasByStatus },
  response: {
    raw: { status },
  },
}) {
  if (schemasByStatus === undefined) {
    return schemas
  }

  const schemaByStatus = schemasByStatus[String(status)] || schemasByStatus.default
  if (schemaByStatus === undefined) {
    return schemas
  }

  const headersA = mergeHeaders([...schemaByStatus.headers, ...schemas.headers], deepMerge)
  const bodyA = deepMerge(schemaByStatus.body, schemas.body)

  return { status: schemas.status, headers: headersA, body: bodyA }
}

module.exports = {
  pickSchemaByStatus,
}
