'use strict'

const test = require('ava')
const execa = require('execa')

const BINARY_PATH = `${__dirname}/../dist/bin/index.js`
const TASKS_FILE = `${__dirname}/tasks.yml`

test('Smoke test', async t => {
  const { code, stdout } = await execa(BINARY_PATH, [TASKS_FILE], {
    reject: false,
  })
  t.snapshot({ code, stdout })
})
