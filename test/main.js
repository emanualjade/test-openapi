import test from 'ava'
import execa from 'execa'

const BINARY_PATH = `${__dirname}/../src/bin/main.js`
const TASKS_FILE = 'test/tasks.yml'

test('Smoke test', async t => {
  const { exitCode, stdout } = await execa(BINARY_PATH, [TASKS_FILE], {
    reject: false,
  })
  const stdoutA = stdout.replace(/User-Agent.*/u, '')
  t.snapshot({ exitCode, stdout: stdoutA })
})
