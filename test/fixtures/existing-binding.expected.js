"use strict";

const uuid = '12345-abcd-1234-efgh-6789-89';
/**
 * We define our own tagging function named gql. This should result in the
 * gql tag not being replaced by the plugin.
 * @param {string[]} parts
 * @return {string}
 */

function gql(parts) {
  return parts.join('');
}

const query = gql`
  people(uuid:"${uuid}") {
    uuid,
    fullName,
    dateOfBirth,
    nextBirthday,
    age,
    relations {
      description,
      type,
      person {
        uuid,
        fullName
      }
    }
    events {
      uuid,
      name,
      description,
      startDate, startTime,
      endDate, endTime
    }
  }`;
