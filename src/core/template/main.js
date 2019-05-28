import { randomHelper } from './variables/random/main.js'
import { envHelper } from './variables/env.js'
import { fakerHelper } from './variables/faker.js'

export const template = {
  $$random: randomHelper,
  $$env: envHelper,
  $$faker: fakerHelper,
}
// eslint-disable-next-line import/no-unused-modules
export { config } from './config.js'
// eslint-disable-next-line import/no-unused-modules
export { run } from './run/main.js'
