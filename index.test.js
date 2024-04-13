import {frontend, backend} from "./index.js";

test("config", () => {
  expect(frontend().test.environment).toBeTruthy();
  expect(backend().test.environment).toBeTruthy();
  expect(backend().test.setupFiles.length).toEqual(1);
  expect(backend().plugins.length).toEqual(1);
  expect(backend({test: {setupFiles: ["foo"]}}).test.setupFiles.length).toEqual(2);
  expect(backend({plugins: ["foo"]}).plugins.length).toEqual(2);
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});
