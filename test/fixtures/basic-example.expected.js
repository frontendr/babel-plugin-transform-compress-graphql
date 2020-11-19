"use strict";

const uuid = "12345-abcd-1234-efgh-6789-89";
const query = `people(uuid:"${uuid}"){uuid,fullName,dateOfBirth,nextBirthday,age,relations{description,type,person{uuid,fullName}}events{uuid,name,description,startDate,startTime,endDate,endTime}}`;
const notAQuery = noQGL`  this is not a GraphQL query and should be left alone  `;
