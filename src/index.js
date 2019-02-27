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
          quasi.quasis.map(({value}) => {
            const part = compress(value.raw).trim();
            value.raw = part;
            value.cooked = part;
          });
          if (!path.scope.hasBinding(tagName)) {
            if (tagFunction) {
              // we have an actual tag function, update the name to match it
              tag.name = tagFunction;
            } else {
              // tag function is empty, replace the TaggedTemplateExpression
              // with the nested TemplateLiteral.
              path.replaceWith(quasi);
            }
          }
        }
      }
    }
  };
}
