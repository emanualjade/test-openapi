import test from 'ava'
import execa from 'execa'
import { getBinPath } from 'get-bin-path'

const BINARY_PATH = getBinPath()
const TASKS_FILE = 'test/tasks.yml'

test('Smoke test', async t => {
  const { exitCode, stdout } = await execa(await BINARY_PATH, [TASKS_FILE], {
    reject: false,
  })
  const stdoutA = stdout.replace(/User-Agent.*/u, '')
  t.snapshot({ exitCode, stdout: stdoutA })
})
