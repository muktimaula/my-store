// src/testing.test.js
// import { sum } from "./sum"; // Sesuaikan path sesuai dengan struktur proyek Anda

// test("adds 1 + 2 to equal 3", () => {
//   expect(sum(1, 2)).toBe(3);
// });
const { sum } = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
