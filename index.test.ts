import {frontend, backend} from "./index.ts";

test("config", () => {
  expect(frontend().test.environment).toBeTruthy();
  expect(backend().test.environment).toBeTruthy();
  expect(backend().test.setupFiles.length).toEqual(1);
  expect(backend().plugins.length).toEqual(1);
  expect(backend({test: {setupFiles: ["foo"]}}).test.setupFiles.length).toEqual(2);
  expect(backend({plugins: [{name: "foo"}]}).plugins.length).toEqual(2);
  expect(backend({plugins: [{name: "1"}, {name: "1"}]}).plugins.length).toEqual(2);
  expect(backend({plugins: [{name: "1"}, {name: "2"}]}).plugins.length).toEqual(3);
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});
