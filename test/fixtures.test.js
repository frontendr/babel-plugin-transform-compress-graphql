const fs = require('fs');
const path = require('path');
const assert = require('assert');

const {transformFileSync} = require('@babel/core');

const babelPluginTransformCompressGraphql = require('../src/index');

const fixtureDir = path.resolve(__dirname, 'fixtures');

/**
 * Compares the fixture file with the given name with it's expected counterpart.
 * @param {string} fixtureName The file name of the fixture without extension.
 * @param {Object} [pluginOpts={}] Optional options passed to the plugin.
 */
function compareInputWithExpected(fixtureName, pluginOpts = {}) {
  const expectedPath = path.join(fixtureDir, fixtureName + '.expected.js');
  const expected = fs
    .readFileSync(expectedPath)
    .toString()
    .trim();

  const inputPath = path.join(fixtureDir, fixtureName + '.js');
  const result = transformFileSync(inputPath, {
    babelrc: false,
    plugins: [[babelPluginTransformCompressGraphql, pluginOpts]]
  }).code;

  assert.strictEqual(result, expected, true);
}

describe('Triggered by a template tag', () => {
  it('should clear any `gql` tags and compress the query.', () => {
    compareInputWithExpected('basic-example');
  });
  it('should not replace any `gql` tags which have an existing binding.', () => {
    compareInputWithExpected('existing-binding');
  });
  it('should replace using a custom tag name.', () => {
    compareInputWithExpected('overridden-tag-name', {
      tagName: 'my_custom_compress_graphql_tag'
    });
  });
  it('should replace using a custom tag function.', () => {
    compareInputWithExpected('overridden-tag-function', {
      tagFunction: 'window.String.raw'
    });
  });
});

describe('Triggered by a comment', () => {
  it('should trigger compression with the default comment.', () => {
    compareInputWithExpected('trigger-by-comment');
  });
  it('should trigger compression with a custom comment.', () => {
    compareInputWithExpected('trigger-by-custom-comment', {
      comment: 'MyCustomComment'
    });
  });
  it('should leave the comment in place when configured so.', () => {
    compareInputWithExpected('leave-comment-in-place', {
      removeComments: false
    });
  });
});
