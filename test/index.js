import test from 'ava'
import execa from 'execa'

const BINARY_PATH = `${__dirname}/../src/bin/index.js`
const TASKS_FILE = `${__dirname}/tasks.json`

test('Smoke test', async t => {
  const { code, stdout } = await execa(BINARY_PATH, [TASKS_FILE], {
    reject: false,
  })
  const stdoutA = stdout.replace(/User-Agent.*/u, '')
  t.snapshot({ code, stdout: stdoutA })
})
