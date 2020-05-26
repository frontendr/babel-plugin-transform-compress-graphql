const ONE = 1;
const TWO = 2;
const queryWithSpace = /* GraphQL */ `{
  a(b: ${ONE} c: true)
}`;

const queryWithComma = /* GraphQL */ `{
  a(b: ${ONE}, c: true)
}`;

const queryWithTrailingVariable = /* GraphQL */ `{
  a(b: ${ONE} c: ${TWO})
}`;

const queryWithNewlines = /* GraphQL */ `{
  a(
    b: ${ONE}
    c: true
  )
}`;
