import {frontend, backend} from "./index.js";

test("config", () => {
  expect(frontend().test.environment).toBeTruthy();
  expect(backend().test.environment).toBeTruthy();
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});
