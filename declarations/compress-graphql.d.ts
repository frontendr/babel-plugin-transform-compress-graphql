/**
 * The graphql template tag is just an alias for StringConstructor.raw.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
 */
declare var gql: (template: TemplateStringsArray, ...substitutions: any[]) => string;
