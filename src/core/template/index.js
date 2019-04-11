/* eslint-disable filenames/no-index */

// eslint-disable-next-line import/no-namespace
import * as config from './config'
// eslint-disable-next-line id-match
import { $$random } from './variables/random/main.js'
// eslint-disable-next-line id-match
import { $$env } from './variables/env.js'
// eslint-disable-next-line id-match
import { $$faker } from './variables/faker.js'

export const template = { $$random, $$env, $$faker }

export { config }
export { run } from './run/main.js'
/* eslint-enable filenames/no-index */
