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
        exit: (path, state) => {
          const {verbose = false} = state.opts;

          if (verbose) {
            const sumCol = i => changed.reduce((s, p) => s + p[i], 0);
            const count = changed.length;
            console.info(
              'Transform compress GraphQL:',
              `Compressed ${count} ${
                count === 1 ? 'query' : 'queries'
              }, saved ${sumCol(0) - sumCol(1)} bytes.`
            );
          }
        }
      },
      TaggedTemplateExpression(path, state) {
        const {tag, quasi} = path.node;
        const {tagName = 'gql', tagFunction = ''} = state.opts;

        if (tag.name === tagName) {
          if (!path.scope.hasBinding(tagName)) {
            tag.name = tagFunction;
          }
          const raw = [];
          const compressed = [];
          quasi.quasis.map(({value}) => {
            raw.push(value.raw);
            const part = compress(value.raw).trim();
            compressed.push(part);
            value.raw = part;
            value.cooked = part;
          });
          changed.push([raw.join('').length, compressed.join('').length]);
        }
      }
    }
  };
}
