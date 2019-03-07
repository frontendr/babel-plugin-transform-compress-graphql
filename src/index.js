'use strict';
import compress from 'graphql-query-compress';

export default function() {
  let changed = [];

  /**
   * Apply the `compress` function to the given `TemplateLiteral`.
   * @param {{quasis: {value: {raw: string, cooked: string}}[], type: string}} literal
   */
  function compressTemplateLiteral(literal) {
    if (literal.type !== 'TemplateLiteral') {
      return;
    }
    literal.quasis.map(({value}) => {
      const part = compress(value.raw).trim();
      value.raw = part;
      value.cooked = part;
    });
  }

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
      /**
       * Checks if a TaggedTemplateExpression is tagged with a function named with the tagName setting, 'gql' by default.
       * If a match is found the contents of the TemplateLiteral is compressed.
       * If the tag has no existing binding it is replaced with the provided tagFunction or it is removed.
       */
      TaggedTemplateExpression(path, state) {
        const {tag, quasi} = path.node;
        const {tagName = 'gql', tagFunction = ''} = state.opts;

        if (tag.name === tagName) {
          // the quasi property contains the TemplateLiteral
          compressTemplateLiteral(quasi);

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
