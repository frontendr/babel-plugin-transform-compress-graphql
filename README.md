# babel-plugin-transform-compress-graphql

> Removes unnecessary white space from GraphQL queries using
> [`graphql-query-compress`](https://www.npmjs.com/package/graphql-query-compress).

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-compress-graphql.svg)](https://www.npmjs.com/package/babel-plugin-transform-compress-graphql)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-transform-compress-graphql.svg)](https://www.npmjs.com/package/babel-plugin-transform-compress-graphql)
[![Build Status](https://travis-ci.org/frontendr/babel-plugin-transform-compress-graphql.svg?branch=master)](https://travis-ci.org/frontendr/babel-plugin-transform-compress-graphql)
[![Coverage Status](https://coveralls.io/repos/github/frontendr/babel-plugin-transform-compress-graphql/badge.svg?branch=develop)](https://coveralls.io/github/frontendr/babel-plugin-transform-compress-graphql?branch=develop)

[![Dependencies](https://img.shields.io/david/frontendr/babel-plugin-transform-compress-graphql.svg)](https://david-dm.org/frontendr/babel-plugin-transform-compress-graphql)
[![DevDependencies](https://img.shields.io/david/dev/frontendr/babel-plugin-transform-compress-graphql.svg)](https://david-dm.org/frontendr/babel-plugin-transform-compress-graphql?type=dev)

## Installation

```sh
npm install --save-dev babel-plugin-transform-compress-graphql
```

## The problem solved

Compress GraphQL queries by simply adding a `/* GraphQL */` comment or tagging them with
the `gql` template tag. The tag name or comment text can be customized with an option.

## Example

### Using the template tag

**In**

```js
const query = gql`
  people(uuid:"${uuid}") {
    uuid,
    fullName,
    dateOfBirth,
    nextBirthday,
    age,
    relations {
      description,
      type,
      person {
        uuid,
        fullName
      }
    }
    events {
      uuid,
      name,
      description,
      startDate, startTime,
      endDate, endTime
    }
  }`;
```

Which is pretty big literal right?

**Out**

```js
const query = `people(uuid:"${uuid}"){uuid,fullName,dateOfBirth,nextBirthday,age,relations{description,type,person{uuid,fullName}}events{uuid,name,description,startDate,startTime,endDate,endTime}}`;
```

Which saves quite some white space which has no use in production builds.

### Using a comment

Since `1.3.0` it's possible to use a comment to mark a template literals as a GraphQL query.

```js
const query = /* GraphQL */ `
  people {
    fullName,
    age
  }
`;
```

The value of the comment can be changed using the `comment` option. The comment is being
matched in a case-insensitive manner so `/* graphql */` is also fine.

**Important:** The comment _only_ works with template literals. Normal strings will not
be compressed.

## Usage

### Via `.babelrc` / `babel.config.js` (Recommended)

**.babelrc**

```json
{
  "env": {
    "production": {
      "plugins": ["transform-compress-graphql"]
    }
  }
}
```

### Via CLI

```sh
babel --plugins transform-compress-graphql script.js
```

### Via Node API

```js
require("@babel/core").transform("code", {
  plugins: ["transform-compress-graphql"],
});
```

## Plugin options

Options can be passed by wrapping the plugin name in an array and adding an
object literal as the second item in that array.

For example in your **.babelrc**:

```json
{
  "env": {
    "production": {
      "plugins": [
        [
          "transform-compress-graphql",
          {
            "tagName": "gql",
            "tagFunction": "",
            "comment": "graphql",
            "removeComments": true
          }
        ]
      ]
    }
  }
}
```

The following options are available:

- `tagName` - `String` with the name of the tag to search for. Defaults
  to `"gql"`.
- `tagFunction` - `String` with the name of the tag to replace the tag with.
  Defaults to: `""` which means the tag will be removed from the output.
- `removeComments` - `Boolean` when set to `false` will leave any matched comments in
  place. Defaults to `true`.
- `comment` - `String` with the case-insensitive text matched in any leading comments
  for a template literal. The entire string will be expected. Defaults to `"graphql"`.

## What about existing variables named `gql`?

For template literals with a tag named `gql` (or with the same name as the `tagName`
option) the scope will be checked for an existing binding of that variable and will not
be replaced with `tagFunction` if it exists.

## Compression

GraphQL literals will be compressed with [`graphql-query-compress`](https://www.npmjs.com/package/graphql-query-compress).
Any issues related to the compressed query result should be posted as an issue in the
[issue tracker](https://github.com/rse/graphql-query-compress/issues) of that package.

## License

MIT
