const queryWithLeadingComment = /* GraphQL */ `
people {
  uuid,
  fullName,
  dateOfBirth,
  nextBirthday
}`;

const queryString = /* GraphQL */ "people {   uuid     fullName   }";

const concatenatedString =
  /* GraphQL */ "people { " +
  "uuid " +
  "fullName " +
  "dateOfBirth " +
  "nextBirthDay " +
  "}";

const normalTemplateLiteral = `people {   uuid     fullName   }`;
const normalStringLiteral = "people {   uuid     fullName   }";
