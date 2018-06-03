'use strict'

// Retrieve `tasks` summarized numbers
const getSummary = function({ tasks }) {
  const total = tasks.length
  const fail = tasks.filter(isFailedTask).length
  const skip = tasks.filter(isSkippedTask).length
  const pass = total - fail - skip
  const ok = fail === 0

  return { ok, total, pass, fail, skip }
}

const isFailedTask = function({ error }) {
  return error !== undefined && !error.skipped
}

const isSkippedTask = function({ error }) {
  return error !== undefined && error.skipped
}

module.exports = {
  getSummary,
}
