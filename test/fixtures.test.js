const fs = require('fs');
const path = require('path');
const assert = require('assert');

const {transformFileSync} = require('@babel/core');

const babelPluginTransformCompressGraphql = require('../src/index');

const fixtureDir = path.resolve(__dirname, 'fixtures');

/**
 * Compares the fixture file with the given name with it's expected counterpart.
 * @param {string} fixtureName The file name of the fixture without extension.
 */
function compareInputWithExpected(fixtureName) {
  const expectedPath = path.join(fixtureDir, fixtureName + '.expected.js');
  const expected = fs
    .readFileSync(expectedPath)
    .toString()
    .trim();

  const inputPath = path.join(fixtureDir, fixtureName + '.js');
  const result = transformFileSync(inputPath, {
    babelrc: false,
    plugins: [babelPluginTransformCompressGraphql]
  }).code;

  assert.strictEqual(result, expected, true);
}

describe('Transforming code', () => {
  it('should replace any `gql` tags with `String.raw`', () => {
    compareInputWithExpected('basic-example');
  });
});
