'use strict'

const { merge } = require('../../../utils')

// `validate.byStatus.*` is like `validate.*` but as map according to status code.
// Used e.g. with OpenAPI specification which allow different responses per status.
const addByStatus = function({ validate: { byStatus, ...validate }, response: { status } }) {
  if (byStatus === undefined) {
    return validate
  }

  const byStatusA = byStatus[String(status)] || byStatus.default
  if (byStatusA === undefined) {
    return validate
  }

  // `byStatus` has lower priority because it comes from another plugin (e.g. `spec`)
  return merge(byStatusA, validate)
}

module.exports = {
  addByStatus,
}
