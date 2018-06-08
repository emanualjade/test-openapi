[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![npm](https://img.shields.io/npm/v/test-openapi.svg)](https://www.npmjs.com/package/test-openapi)
![node](https://img.shields.io/node/v/test-openapi.svg)
![maintenance](https://img.shields.io/maintenance/yes/2018.svg)

# Usage

```shell
yarn integrationTest
```

# Test files

Test files are YAML (or JSON) files at `specification/**/*.tasks.yml`

Each test file is a plain object where each key/property is a single test.

A single test performs the following:

- it sends an HTTP request to our API. The request parameters are specified
  using the `call` property.
- it validates the HTTP response according to the `validate` property.

# Example test file

```yml
example:
  call:
    method: GET
    server: http://localhost:8081
    path: /icoTagNames
    query.onlyPublic: false
  validate:
    status: 200
    body:
      type: array
      # Each tag object
      items:
        type: object
        required: [tag, isPublic]
        properties:
          tag:
            type: string
            maxLength: 32
          isPublic:
            type: boolean
```

This test calls `GET http://localhost:8081/icoTagNames?onlyPublic=false`, then validates
that the response status is `200` and the response body is an array of
`{ tag: string, isPublic: boolean }`

# OpenAPI

However we already described our API endpoints with OpenAPI, including the HTTP methods,
URLs, paths, query variables, request bodies, response statuses, response headers
and response bodies. So we do not need to repeat them in our tests.

We only need to specify request parameters and response validation when they
differ from the OpenAPI specification. For example: "if this query variable is
set to this value, validate that the status code is 403". The OpenAPI
specification will automatically be deeply merged to the tests.

To re-use the OpenAPI specification, the `operationId` must be prefixed to the
test's key.

The above example could then be simplified to:

```yml
getIcoTagNames.example:
  call:
    query.onlyPublic: false
  validate: {}
```

Also please note that only OpenAPI parameters that are `required` are re-used.
OpenAPI parameters that are not `required` are only re-used if specified in
the test.

# Available properties

Each test can use the following properties:

```yml
operationId.testName:
  call:
    method: string
    server: string
    path: string
    url.NAME: string
    query.NAME: string
    headers.NAME: string or number
    body: object
  validate:
    status: number
    headers.NAME: string or number
    body: object or array
# More tests
...
```

- `operationId`: OpenAPI's `operationId`, i.e. a unique string identifying
  an endpoint. For example `getIcoTagNames`.
- `testName`: an arbitratry name for the test.
- `call`: HTTP request parameters
  - `method`: HTTP method
  - `server`: server's origin (protocol + host)
  - `path`: URL's path
  - `url.NAME`: variable inside the URL using `{NAME}` notation.
    For example, if the path is `/companies/{companyId}` it can be `path.companyId`.
  - `query.NAME`: URL query variable
  - `headers.NAME`: HTTP request header
  - `body`: request body. Is usually an object or an array.
- `validate`: HTTP response
  - `status` (default: `200`): HTTP status code
  - `headers.NAME`: response header
  - `body`: response body

# JSON schema validation

Comparing the `validate.status`, `validate.headers.NAME` and `validate.body`
against a specific value is simple. However if we need more elaborated
validation, we can use a [JSON schema version 4](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject).

For example to validate that the response body is an array:

```yml
operationId.testName:
  validate:
    body:
      type: array
```

# Random parameter

The `random` property can be used to generate random parameters. It's exactly
like the `call` property except that values are [JSON schemas](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject).

For example to generate a random password of minimum 12 characters:

```yml
operationId.testName:
  random:
    query.password:
      type: string
      minLength: 12
      pattern: '[a-zA-Z0-9]'
```

# Empty parameter

Using the value `null` or the JSON schema `type: 'null'` means "not set".

For example "do not generate this request parameter", "this response header should not
be present" or "the response body should be empty".

# Troubleshooting

- `yarn integrationTest` first populates a test database, which takes about
  20 seconds. We are working on solutions to improve the performance here.
