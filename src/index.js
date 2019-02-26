'use strict';
import compress from 'graphql-query-compress';

export default function(api) {
  let changed = [];
  return {
    name: 'transform-compress-graphql',
    visitor: {
      Program: {
        enter: () => {
          changed = [];
        },
        exit: () => {
          // log what's changed?
        }
      },
      TaggedTemplateExpression(path, state) {
        const {tag, quasi} = path.node;
        const {tagName = 'gql', tagFunction = ''} = state.opts;

        if (tag.name === tagName) {
          if (!path.scope.hasBinding(tagName)) {
            tag.name = tagFunction;
          }
          quasi.quasis.map(({value}) => {
            const part = compress(value.raw).trim();
            value.raw = part;
            value.cooked = part;
          });
        }
      }
    }
  };
}
