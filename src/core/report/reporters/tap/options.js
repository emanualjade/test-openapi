import { green, red, gray, yellow } from '../../utils.js'

// eslint-disable-next-line import/no-namespace
import * as serializer from './serializer.js'

// Set TAP state
const options = function({ _tasks: tasks }) {
  const count = tasks.length
  const tap = serializer.init({ count, colors: THEME })
  return { tap }
}

const THEME = {
  pass: green,
  fail: red,
  comment: gray,
  skip: gray,
  version: gray,
  plan: gray,
  final: yellow,
}

module.exports = {
  options,
}
