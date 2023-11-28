# MikroTester

**Smooth, minimalist integration testing for humans**.

![Build Status](https://github.com/mikaelvesavuori/mikrotester/workflows/main/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mikaelvesavuori_mikrotester&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mikaelvesavuori_mikrotester) [![codecov](https://codecov.io/gh/mikaelvesavuori/mikrotester/graph/badge.svg?token=3EWQNXW7JG)](https://codecov.io/gh/mikaelvesavuori/mikrotester) [![Maintainability](https://api.codeclimate.com/v1/badges/00eea783405eaaab55e3/maintainability)](https://codeclimate.com/github/mikaelvesavuori/mikrotester/maintainability)

---

Integration testing is sometimes made harder and more complicated than it really is. If you ever wanted to do integration testing with the least amount of effort, then MikroTester should fit like hand in glove.

- Simple syntax
- Lightweight, only one dependency, [Ajv](https://ajv.js.org), which is used for JSON schema comparisons
- High test coverage

## Behavior

MikroTester allows you to pass in an array of simple-to-define tests. For each endpoint, you may add one or multiple assertions.

The result will always contain a boolean (true/false) `success` state for each assertion.

[Native Fetch](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch) is used, so you will need a Node version newer than 18 or so.

## Usage

MikroTester is very simple to use. We'll use the [Star Wars API](https://swapi.dev) to demonstrate just how easy it is!

```ts
import { MikroTester } from 'mikrotester';

const tests = [
  {
    "endpoint": "https://swapi.dev/api/people/1",
    "method": "GET",
    "assertions": [
      {
        "name": "The status code is 200",
        "statusCodeIs": 200
      }
    ]
  }
];

const mikrotester = new MikroTester();
const results = await mikrotester.runTests(tests);

console.log(results);
```

So, what's going on here?

- The `endpoint` should be self-explanatory.
- The `method` can be `GET`, `POST`, `PUT`, `PATCH` and `DELETE`.
- The `assertions` always contain a `name` (what does the test do?) and one of several types: `statusCodeIs`, `is`, or `matches`.

You can also send in a `headers` object if you want and need it!

Next, let's check out all the ways you can do those assertions.

### Matches (`matches`)

Use a [JSON Schema](https://json-schema.org) to check your response. This is a good, solid option for more mature tests.

```json
[
  {
    "endpoint": "https://swapi.dev/api/people/1",
    "method": "GET",
    "assertions": [
      {
        "name": "The result matches the JSON Schema",
        "matches": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "name": {
              "type": "string"
            },
            "height": {
              "type": "string"
            },
            "mass": {
              "type": "string"
            },
            "hair_color": {
              "type": "string"
            },
            "skin_color": {
              "type": "string"
            },
            "eye_color": {
              "type": "string"
            },
            "birth_year": {
              "type": "string"
            },
            "gender": {
              "type": "string"
            },
            "homeworld": {
              "type": "string"
            },
            "films": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "species": {
              "type": "array",
              "items": {}
            },
            "vehicles": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "starships": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "created": {
              "type": "string"
            },
            "edited": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "required": [
            "birth_year",
            "created",
            "edited",
            "eye_color",
            "films",
            "gender",
            "hair_color",
            "height",
            "homeworld",
            "mass",
            "name",
            "skin_color",
            "species",
            "starships",
            "url",
            "vehicles"
          ]
        }
      }
    ]
  }
]
```

### Is object (`is`)

Check for an exact match of the object. For very stable systems this will work just fine, but it also creates quite a bit of coupling between test and reality.

```json
[
  {
    "endpoint": "https://swapi.dev/api/people/1",
    "method": "GET",
    "assertions": [
      {
        "name": "The result is exactly correct",
        "is": {
          "name": "Luke Skywalker",
          "height": "172",
          "mass": "77",
          "hair_color": "blond",
          "skin_color": "fair",
          "eye_color": "blue",
          "birth_year": "19BBY",
          "gender": "male",
          "homeworld": "https://swapi.dev/api/planets/1/",
          "films": [
            "https://swapi.dev/api/films/1/",
            "https://swapi.dev/api/films/2/",
            "https://swapi.dev/api/films/3/",
            "https://swapi.dev/api/films/6/"
          ],
          "species": [],
          "vehicles": ["https://swapi.dev/api/vehicles/14/", "https://swapi.dev/api/vehicles/30/"],
          "starships": [
            "https://swapi.dev/api/starships/12/",
            "https://swapi.dev/api/starships/22/"
          ],
          "created": "2014-12-09T13:50:51.644000Z",
          "edited": "2014-12-20T21:17:56.891000Z",
          "url": "https://swapi.dev/api/people/1/"
        }
      }
    ]
  }
]
```

### Is response (`is`)

Check for an exact string response. Good for simple services that give short, stable messages.

```json
[
  {
    "endpoint": "https://swapi.dev/api/people/3",
    "method": "GET",
    "assertions": [
      {
        "name": "The message matches",
        "is": "There is a message here"
      }
    ]
  }
]
```

### Status code is (`statusCodeIs`)

Verifies that the status code is the expected one.

```json
[
  {
    "endpoint": "https://swapi.dev/api/people/1",
    "method": "GET",
    "assertions": [
      {
        "name": "The status code is 200",
        "statusCodeIs": 200
      }
    ]
  }
]
```

## The response

The response for all of the calls will be:

```json
[
  {
    "name": "Your test name",
    "success": true, // Always a boolean
    "status": 200, // Whatever the response status code was
    "response": { ... }, // Response from the integration call
    "expected": { ... } // Assertion that you passed in
  },
  {
    ... // Next test
  }
]
```

## License

MikroTester is licensed under the [MIT license](./LICENSE).
