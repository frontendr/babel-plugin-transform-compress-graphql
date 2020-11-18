"use strict";

const ONE = 1;
const TWO = 2;
const queryWithSpace = `{a(b:${ONE} c:true)}`;
const queryWithComma = `{a(b:${ONE},c:true)}`;
const queryWithTrailingVariable = `{a(b:${ONE} c:${TWO})}`;
const queryWithNewlines = `{a(b:${ONE} c:true)}`;
const NAME = "name";
const TYPE = "type";
const SPACE = " ";
const queryWithFragment = `fragment ${SPACE} ${NAME} on ${TYPE}{id name}`;
