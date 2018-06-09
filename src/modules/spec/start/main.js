'use strict'

const { loadOpenApiSpec } = require('./load')
const { normalizeSpec } = require('./normalize')

// Parse, validate and normalize an OpenAPI specification (including JSON references)
// then add it to `task.random|validate.*`
const loadNormalizedSpec = async function({ spec }) {
  if (spec === undefined) {
    return
  }

  const specA = await loadOpenApiSpec({ spec })

  const specB = normalizeSpec({ spec: specA })

  return { spec: specB }
}

module.exports = {
  loadNormalizedSpec,
}
