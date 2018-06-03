'use strict'

// Ends TAP v13 output
const endTap = function({
  tasks,
  config: {
    tap: { writer },
  },
}) {
  writeEndComments({ tasks, writer })

  writer.close()
}

// Write # tests|pass|fail|skip|ok comments at the end
const writeEndComments = function({ tasks, writer }) {
  const pass = tasks.filter(isPassedTask).length
  const fail = tasks.filter(isFailedTask).length
  const skip = tasks.filter(isSkippedTask).length

  writer.end({ pass, fail, skip })
}

const isPassedTask = function({ error }) {
  return error === undefined
}

const isFailedTask = function({ error }) {
  return error !== undefined && !error.skipped
}

const isSkippedTask = function({ error }) {
  return error !== undefined && error.skipped
}

module.exports = {
  endTap,
}
