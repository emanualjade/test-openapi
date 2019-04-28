import { randomHelper } from './variables/random/main.js'
import { envHelper } from './variables/env.js'
import { fakerHelper } from './variables/faker.js'

export const template = {
  $$random: randomHelper,
  $$env: envHelper,
  $$faker: fakerHelper,
}
export { config } from './config.js'
export { run } from './run/main.js'
