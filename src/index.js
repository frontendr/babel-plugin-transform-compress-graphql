'use strict';

const compress = query =>
  query
    .replace(/#.*\n/g, '')
    .replace(/[\s|,]*\n+[\s|,]*/g, ' ')
    .replace(/\s?([:,{}()=@])\s?/g, '$1')
    .replace(/\s([$.])/g, '$1')
    .trim();

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
        const {tagName = 'gql', tagFunction = 'String.raw'} = state.opts;

        if (tag.name === tagName) {
          if (!path.scope.hasBinding(tagName)) {
            tag.name = tagFunction;
          }
          quasi.quasis.map(({value}) => {
            const part = compress(value.raw);
            value.raw = part;
            value.cooked = part;
          });
        }
      }
    }
  };
}
