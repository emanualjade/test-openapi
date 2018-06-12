'use strict'

const notifier = require('node-notifier')

const { getSummary } = require('../../utils')

// Show notification at end of run if `config.report.notify: true`
const end = function({ tasks }) {
  const opts = getOpts({ tasks })
  notifier.notify(opts)
}

const getOpts = function({ tasks }) {
  const { ok, total, pass, fail, skip } = getSummary({ tasks })

  const opts = OPTS[ok]
  const message = opts.message({ total, pass, fail, skip })

  return { ...opts, message }
}

const getPassMessage = function({ total, pass, skip }) {
  const skipMessage = getSkipMessage({ skip })
  return `${pass} of ${total} tasks passed.${skipMessage}`
}

const getSkipMessage = function({ skip }) {
  if (skip === 0) {
    return ''
  }

  return `\n${skip} tasks were skipped.`
}

const getFailMessage = function({ total, fail }) {
  return `${fail} of ${total} tasks failed.`
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
