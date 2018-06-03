'use strict'

const notifier = require('node-notifier')

// Show notification at end of run if `config.report.notify: true`
const end = function({ tasks }) {
  const { count, failed, passed } = getCounts({ tasks })
  const opts = getOpts({ failed })
  const optsA = addMessage({ count, failed, passed, opts })

  notifier.notify(optsA)
}

const getCounts = function({ tasks }) {
  const count = tasks.length
  const failed = tasks.filter(({ error }) => error !== undefined).length
  const passed = count - failed
  return { count, failed, passed }
}

const getOpts = function({ failed }) {
  if (failed > 0) {
    return FAILED_OPTS
  }

  return PASSED_OPTS
}

const FAILED_OPTS = {
  title: 'Tasks failed!',
  message: ({ count, failed }) => `${failed} of ${count} tasks failed.`,
  icon: `${__dirname}/failed.png`,
  sound: 'Basso',
}

const PASSED_OPTS = {
  title: 'Tasks passed.',
  message: ({ count, passed }) => `${passed} of ${count} tasks passed.`,
  icon: `${__dirname}/passed.png`,
  sound: false,
}

const addMessage = function({ count, failed, passed, opts, opts: { message } }) {
  const messageA = message({ count, failed, passed })
  return { ...opts, message: messageA }
}

module.exports = {
  end,
}
