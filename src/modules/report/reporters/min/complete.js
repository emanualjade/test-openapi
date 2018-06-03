'use strict'

const complete = function({ task: { title }, error, options: { spinner } }) {
  const failed = error !== undefined

  spinner.update({ clear: failed })

  if (!failed) {
    return
  }

  return `${title}\n`
}

module.exports = {
  complete,
}
