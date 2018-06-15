'use strict'

const notifier = require('node-notifier')

const { getSummary } = require('../../utils')

// Show notification at end of run if `config.report.notify: true`
const end = function({
  tasks,
  config: {
    report: {
      level: { types },
    },
  },
}) {
  const opts = getOpts({ tasks, types })

  if (opts.message === '') {
    return
  }

  notifier.notify(opts)
}

const getOpts = function({ tasks, types }) {
  const { ok, total, pass, fail, skip } = getSummary({ tasks })

  const opts = OPTS[ok]

  const message = getMainMessage({ opts, ok, total, pass, fail, types })

  const messageA = addSkipMessage({ message, skip, types })

  return { ...opts, message: messageA }
}

const getMainMessage = function({ opts, ok, total, pass, fail, types }) {
  // Apply `config.report.level`
  const silent = (ok && !types.includes('pass')) || (!ok && !types.includes('fail'))
  if (silent) {
    return ''
  }

  return opts.message({ total, pass, fail })
}

const getPassMessage = function({ total, pass }) {
  return `${pass} of ${total} tasks passed.`
}

const getFailMessage = function({ total, fail }) {
  return `${fail} of ${total} tasks failed.`
}

const addSkipMessage = function({ message, skip, types }) {
  if (skip === 0 || !types.includes('skip')) {
    return message
  }

  return `${message}\n${skip} tasks were skipped.`
}

const PASS_OPTS = {
  title: 'Tasks passed.',
  message: getPassMessage,
  icon: `${__dirname}/passed.png`,
  sound: false,
}

const FAIL_OPTS = {
  title: 'Tasks failed!',
  message: getFailMessage,
  icon: `${__dirname}/failed.png`,
  sound: 'Basso',
}

const OPTS = {
  true: PASS_OPTS,
  false: FAIL_OPTS,
}

module.exports = {
  end,
}
