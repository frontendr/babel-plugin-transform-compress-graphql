# babel-plugin-transform-compress-graphql

> Removes unnecessary white space from GraphQL queries.

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-compress-graphql.svg)](https://www.npmjs.com/package/babel-plugin-transform-compress-graphql)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-transform-compress-graphql.svg)](https://www.npmjs.com/package/babel-plugin-transform-compress-graphql)
[![Build Status](https://travis-ci.org/frontendr/babel-plugin-transform-compress-graphql.svg?branch=master)](https://travis-ci.org/frontendr/babel-plugin-transform-compress-graphql)

[![Dependencies](https://img.shields.io/david/frontendr/babel-plugin-transform-compress-graphql.svg)](https://david-dm.org/frontendr/babel-plugin-transform-compress-graphql)
[![DevDependencies](https://img.shields.io/david/dev/frontendr/babel-plugin-transform-compress-graphql.svg)](https://david-dm.org/frontendr/babel-plugin-transform-compress-graphql?type=dev)

## Installation

```sh
npm install --save-dev babel-plugin-transform-compress-graphql
```

## The problem solved

Compress GraphQL queries by simply tagging them with the `gql` template tag.

## Example

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

Which is is pretty big literal right?

**Out**
```js
const query = String.raw`people(uuid:"${uuid}"){uuid fullName dateOfBirth nextBirthday age relations {description type person{uuid fullName}}events{uuid name description startDate startTime endDate endTime}}`
```

Which saves quite some white space which has no use in production builds.

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
require('babel-core').transform('code', {
  plugins: [
    'transform-compress-graphql',
  ],
});
```

## License

MIT
