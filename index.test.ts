import {frontend, backend} from "./index.ts";

test("config", () => {
  const url = import.meta.url;
  expect(frontend({url}).test?.environment).toBeTruthy();
  expect(backend({url}).test?.environment).toBeTruthy();
  expect(backend({url}).test?.setupFiles?.length).toEqual(1);
  expect(backend({url}).plugins?.length).toEqual(1);
  expect(backend({url, test: {setupFiles: ["foo"]}}).test?.setupFiles?.length).toEqual(2);
  expect(backend({url, plugins: [{name: "foo"}]}).plugins?.length).toEqual(2);
  expect(backend({url, plugins: [{name: "1"}, {name: "1"}]}).plugins?.length).toEqual(2);
  expect(backend({url, plugins: [{name: "1"}, {name: "2"}]}).plugins?.length).toEqual(3);
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});
