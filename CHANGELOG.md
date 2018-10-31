# Upcoming

## Dependencies

- Upgrade `swagger-parser`

# 40.2.2

## Bug fixes

- Fix `expected` value appearing `undefined` during task failures

# 40.2.1

## Dependencies

- Upgrade `eslint`
- Upgrade `node-notifier`
- Upgrade `cross-fetch`
- Upgrade `eslint-config-standard-prettier-fp`
- Upgrade `eslint-plugin-node`
- Upgrade `eslint-plugin-markdown`

# 40.2.0

## Features

- Make reporting much faster, and also prettier

# 40.1.0

## Breaking changes

Rename `repeat` task property to `repeat.times`.

For example the following task:

```
- name: taskName
  repeat: 5
```

will need to be migrated to:

```
- name: taskName
  repeat:
    times: 5
```

## Features

- Add `repeat.data` for data-driven testing

# 39.2.1

## Bug fixes

- Fix `$$env` not working

# 39.2.0

## Features

- Support OpenAPI 2.0 `operation.schemes`

# 39.1.0

## Features

- Support `specification.schemes` from OpenAPI 2.0

## Upgrade dev dependencies

- `eslint-config-standard-prettier-fp`

# 39.0.1

## Bug fixes

- fix crash when OpenAPI `consumes` property is `undefined`

# 39.0.0

## Bug fixes

- fix binary file not being published to npm

## Documentation

- Update `README.md`
- Update CLI `--help` message
- Add `CHANGELOG.md`

## Upgrade dependencies

- Node to `10.12`
- `yargs`
- `swagger-parser`
- `eslint`
- `eslint-config-standard-prettier-fp`
- `release-it`
- `slice-ansi`
