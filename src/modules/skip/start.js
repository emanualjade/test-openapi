'use strict'

// When using `config.skip: '*'`, it behaves like a dry run, i.e. no reporting
const start = function({ skip, report }) {
  if (!isDryRun({ skip })) {
    return
  }

  return { report: { ...report, output: false } }
}

const isDryRun = function({ skip }) {
  return skip === '*' || (Array.isArray(skip) && skip.includes('*'))
}

module.exports = {
  start,
}
