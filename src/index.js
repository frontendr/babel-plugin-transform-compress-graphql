"use strict";
import compress from "graphql-query-compress";

const GRAPHQL_KEY_START = /^[a-z]/i;
const DEFAULT_COMMENT = "graphql";

export default function () {
  /**
   * Checks if a `TaggedTemplateExpression` is tagged with a function named with the
   * tagName setting, 'gql' by default.
   * If a match is found the contents of the TemplateLiteral is compressed.
   * If the tag has no existing binding it is replaced with the provided tagFunction
   * or it is removed.
   */
  function compressTaggedTemplateExpression(path, state) {
    const { tag, quasi } = path.node;
    const { tagName = "gql", tagFunction } = state.opts;

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

  /**
   * Checks if the `TemplateLiteral` or `StringLiteral` has a leading comment that
   * matches the comment setting (case-insensitive), 'graphql' by default.
   *
   * If a matching literal with comment is found the literal is compressed.
   * When not disabled by the setting removeComments, the matched comment is removed.
   */
  function compressCommentedNode(path, state) {
    if (!path.node.leadingComments) {
      return;
    }

    const { leadingComments, type } = path.node;
    const commentTrigger = (state.opts.comment || DEFAULT_COMMENT).toLowerCase();
    const commentIndex = leadingComments.findIndex(
      (comment) => trimComment(comment.value).toLowerCase() === commentTrigger
    );
    if (commentIndex >= 0) {
      // there is a leading comment that matches our 'comment' setting
      switch (type) {
        case "TemplateLiteral":
          compressTemplateLiteral(path.node);
          break;
        case "StringLiteral":
          compressStringLiteral(path.node);
          break;
      }

      // remove the matched comment
      if (state.opts.removeComments !== false) {
        path.node.leadingComments.splice(commentIndex, 1);
      }
    }
  }

  /**
   * Apply the `compress` function to the given `TemplateLiteral`.
   * @param {{quasis: {value: {raw: string, cooked: string}}[], type: string}} node
   */
  function compressTemplateLiteral(node) {
    node.quasis.map(({ value }, index) => {
      const part = compress(value.raw).trim();
      const prefix = index > 0 && part.match(GRAPHQL_KEY_START) ? " " : "";
      // Multiple quasi's should be separated as they contain variables. (#4)
      value.raw = prefix + part;
      value.cooked = prefix + part;
    });
  }

  /**
   * Apply the `compress` function to the given `StringLiteral`.
   * @param node
   */
  function compressStringLiteral(node) {
    node.value = compress(node.value).trim();
  }

  /**
   * Trim excess white space and '*' characters from the given comment.
   * @param {string} comment The given comment.
   * @returns {string} The trimmed comment.
   */
  function trimComment(comment) {
    return comment.replace(/^[\s*]+/, "").replace(/[\s*]+$/, "");
  }

  return {
    name: "transform-compress-graphql",
    visitor: {
      TaggedTemplateExpression: compressTaggedTemplateExpression,
      TemplateLiteral: compressCommentedNode,
      StringLiteral: compressCommentedNode,
    },
  };
}
