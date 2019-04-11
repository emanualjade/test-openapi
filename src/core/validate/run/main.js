import { normalizeValidate } from './normalize.js'
import { handleJsonSchemas } from './json_schema.js'
import { addByStatus } from './by_status.js'
import { validateStatus } from './status/main.js'
import { validateHeaders } from './headers.js'
import { validateBody } from './body.js'

// Validate response against `task.validate.*` JSON schemas
export const run = function({ validate = {}, call, call: { response } = {} }) {
  if (call === undefined) {
    return
  }

  const validateA = normalizeValidate({ validate })

  const validateB = addByStatus({ validate: validateA, response })

  const validateC = handleJsonSchemas({ validate: validateB })

  validateStatus({ validate: validateC, response })
  validateHeaders({ validate: validateC, response })
  validateBody({ validate: validateC, response })
}
