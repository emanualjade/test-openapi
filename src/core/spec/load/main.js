'use strict'

const { loadOpenApiSpec } = require('./load')
const { normalizeSpec } = require('./normalize')

// Parse, validate and normalize an OpenAPI specification (including JSON references)
// then add it to `task.call|validate.*`
const load = async function(tasks, { config: { spec } }) {
  if (spec === undefined) {
    return
  }

  const specA = await loadOpenApiSpec({ spec })

  const specB = normalizeSpec({ spec: specA })

  return tasks.map(task => ({ ...task, spec: { ...task.spec, definition: specB } }))
}

module.exports = {
  load,
}
