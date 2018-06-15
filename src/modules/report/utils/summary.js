'use strict'

const { getResultType } = require('./result_type')

// Retrieve `tasks` summarized numbers
const getSummary = function({ tasks }) {
  const total = tasks.length

  const resultTypes = tasks.map(getResultType)
  const fail = resultTypes.filter(resultType => resultType === 'fail').length
  const skip = resultTypes.filter(resultType => resultType === 'skip').length
  const pass = total - fail - skip

  const ok = fail === 0

  return { ok, total, pass, fail, skip }
}

module.exports = {
  getSummary,
}
