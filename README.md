[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![npm](https://img.shields.io/npm/v/test-openapi.svg)](https://www.npmjs.com/package/autoserver)
![node](https://img.shields.io/node/v/test-openapi.svg)
![maintenance](https://img.shields.io/maintenance/yes/2018.svg)

# Usage

```shell
test-openapi --server https://api.example.com --spec path/to/my/openapi.json
path/**/*.test.yml
```

Automatically test your API based on a [Swagger/OpenAPI 2.0](https://www.openapis.org/)
specification.

Note: this is still quite unstable. It should get more stable in coming weeks though.

# OpenAPI

[OpenAPI](https://www.openapis.org/) (formerly Swagger) is a specification
allowing you to describe your API endpoints: URLs, parameters, responses,
authentication, etc.

For example, an API with an endpoint:

```HTTP
GET /companies/{companyId}?hasWebsite=boolean
```

returning

```JSON
{ "id": 50, "name": "Company name", "websiteUrl": "url" }
```

could be described as:

```yml
swagger: '2.0'
info:
  title: Example API
  version: 1.0.0
paths:
  /companies/{companyId}:
    get:
      operationId: getCompany
      parameters:
      - name: companyId
        in: path
        required: true
        type: integer
      - name: hasWebsite
        in: query
        type: boolean
      responses:
        200:
          schema:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              websiteUrl:
                type: string
```

# Example test

Using the OpenAPI definition above, let's say you want to test that when the
`hasWebsite` query variable is set to `true`, the returned company must have a
`websiteUrl`. The test would look like:

```yml
getCompany.website:
  request:
    query.hasWebsite: true
  response:
    body:
      required: [websiteUrl]
```

# Tests

Tests are specified in YAML or JSON files looking like this:

```yml
operationId.testName:
  request:
    path.pathVariableName: jsonSchema
    query.queryVariableName: jsonSchema
    headers.headerName: jsonSchema
    body[.formDataVariableName]: jsonSchema
  response:
    status: statusCodeNumber
    body: jsonSchema
    headers.headerName: jsonSchema
...
```

Each `operationId.testName` is a single test which will be performed as followed:

* an HTTP request is sent to the server. Its parameters (URL, query variables,
  headers, request body) are randomly generated according to the `request` properties.
* the server response is validated according to the `response` properties.

Both `request` and `response` properties are optional. If missing, they will
default to what a request/response should look like according to your OpenAPI
specification. This means for most tests you only need to explicit few `request`
and `response` properties: `test-openapi` will automate the rest.

# Properties

* `operationId` `{string}`: OpenAPI's `operationId`, i.e. a unique string identifying
  an endpoint. For example `getCompany`.
* `testName` `{string}`: an arbitratry name for the test. For example `authenticationCheck`.
* `request` `{object}`: specify how to send the HTTP request
  * `path.pathVariableName` `{jsonSchema}`: variable inside the URL.
    For example, if the path is `/companies/{companyId}`, can be `path.companyId`.
    `pathVariableName` should match the OpenAPI `path` parameter name.
  * `query.queryVariableName` `{jsonSchema}`: same but for a query variable
  * `headers.headerName` `{jsonSchema}`: same but for a HTTP request header
  * `body` `{jsonSchema}`: same but for the request body
  * `body.formDataVariableName` `{jsonSchema}`: same but for a property inside a
    `multipart/form-data` request body. I.e. an OpenAPI `formData` parameter.
* `response` `{object}`: how the HTTP response should look like
  * `status` `{string}`: HTTP status code
  * `body` `{jsonSchema}`: HTTP response body
  * `headers.headerName` `{jsonSchema}`: HTTP response header

`request` and `response` properties are deeply merged into their corresponding OpenAPI
definition. For example, a `request.query.companyId` property would be merged to
its corresponding OpenAPI `companyId` parameter definition.

The value of any `request` and `response` property can be:

* a [JSON schema version 4](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject).
  The value will be randomly generated accordingly.
* a specific string, number, boolean, array or null
* the string `invalid`: will generate a random value that _does not_ match the OpenAPI definition.
  This is useful when you want to test whether invalid parameters send proper
  error responses.
* Using the value `null` or the JSON schema `type: 'null'` means "not set".
  I.e. "do not generate this request parameter", "this response header should not
  be present" or "the response body should be empty".

# Similar projects

* [Dredd](https://github.com/apiaryio/dredd): high-profile project with a similar concept. However it only does smoke testing. In particular error responses are not validated and only one HTTP request is performed per endpoint. Also many tests require to manually add JavaScript "hooks".
* [Swagger test templates](https://github.com/apigee-127/swagger-test-templates): requires a compilation step and quite a lot of boilerplate.
* [Abao](https://github.com/cybertk/abao): similar to Dredd but for RAML instead of OpenAPI
