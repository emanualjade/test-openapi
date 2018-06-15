'use strict'

const notifier = require('node-notifier')

const { getSummary } = require('../../utils')
const { isSilentSummary } = require('../../level')

// Show notification at end of run if `config.report.notify: true`
const end = function({ tasks, config }) {
  const opts = getOpts({ tasks, config })

  if (opts === undefined) {
    return
  }

  notifier.notify(opts)
}

const getOpts = function({ tasks, config }) {
  const { ok, total, pass, fail, skip } = getSummary({ tasks })

  const { resultType, ...opts } = OPTS[ok]

  if (isSilentSummary({ resultType, config })) {
    return
  }

  const message = opts.message({ total, pass, fail })

  const messageA = addSkipMessage({ message, skip, config })

  return { ...opts, message: messageA }
}

const getPassMessage = function({ total, pass }) {
  return `${pass} of ${total} tasks passed.`
}

const getFailMessage = function({ total, fail }) {
  return `${fail} of ${total} tasks failed.`
}

const addSkipMessage = function({ message, skip, config }) {
  if (skip === 0 || isSilentSummary({ resultType: 'skip', config })) {
    return message
  }

  return `${message}\n${skip} tasks were skipped.`
}

const PASS_OPTS = {
  title: 'Tasks passed.',
  message: getPassMessage,
  icon: `${__dirname}/passed.png`,
  sound: false,
  resultType: 'pass',
}

const FAIL_OPTS = {
  title: 'Tasks failed!',
  message: getFailMessage,
  icon: `${__dirname}/failed.png`,
  sound: 'Basso',
  resultType: 'fail',
}

const OPTS = {
  true: PASS_OPTS,
  false: FAIL_OPTS,
}

module.exports = {
  end,
}
