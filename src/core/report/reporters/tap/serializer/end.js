import { getPlanString } from './plan.js'

// Final TAP comments, indicating number of tests|pass|fail|skip
export const end = function({ pass, fail, skip, count: initialCount, colors }) {
  const count = pass + fail + skip

  const planString = getPlan({ colors, initialCount, count })

  const endCommentString = getEndCommentString({ pass, fail, skip, count })

  const endComment = [...planString, colors.final(endCommentString)].join(
    '\n\n',
  )

  return `${endComment}\n`
}

// Add final plan if not initially specified
const getPlan = function({ colors, initialCount, count }) {
  if (initialCount !== undefined) {
    return []
  }

  const planString = getPlanString({ count })
  return [colors.plan(planString)]
}

const getEndCommentString = function({ pass, fail, skip, count }) {
  const endOk = getEndOk({ fail })

  return `# tests: ${count}
# pass: ${pass}
# fail: ${fail}
# skip: ${skip}${endOk}`
}

// Add # ok final comment if no test failed
const getEndOk = function({ fail }) {
  if (fail !== 0) {
    return ''
  }

  return '\n# ok'
}
