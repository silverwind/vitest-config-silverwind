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

test("coverage defaults", () => {
  const url = import.meta.url;
  const config = backend({url});
  const coverage = config.test?.coverage as any;
  expect(coverage.provider).toEqual("v8");
  expect(coverage.reporter).toEqual(["text"]);
  expect(coverage.include).toEqual(["**/*.{js,ts,jsx,tsx}"]);
  expect(coverage.exclude).toContainEqual("**/*.test.*");
  expect(coverage.exclude).toContainEqual("**/*.d.ts");
});

test("coverage merge preserves defaults", () => {
  const url = import.meta.url;
  const config = backend({url, test: {coverage: {include: ["src/**/*.ts"], exclude: ["src/generated.ts"]}}});
  const coverage = config.test?.coverage as any;
  expect(coverage.provider).toEqual("v8");
  expect(coverage.include).toEqual(["src/**/*.ts"]);
  expect(coverage.exclude).toContainEqual("**/*.test.*");
  expect(coverage.exclude).toContainEqual("**/*.d.ts");
  expect(coverage.exclude).toContainEqual("src/generated.ts");
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});

// Node 25+ enables Web Storage by default which shadows happy-dom's Storage in
// vitest's env setup, leaving `localStorage` undefined. The frontend config
// passes --no-experimental-webstorage to fix this.
// https://github.com/vitest-dev/vitest/issues/8757
// https://github.com/capricorn86/happy-dom/issues/1950
test("frontend disables node webstorage on node 25+", () => {
  const url = import.meta.url;
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const expected = nodeMajor >= 25 ? ["--no-experimental-webstorage"] : [];
  expect(frontend({url}).test?.execArgv).toEqual(expected);
  expect(backend({url}).test?.execArgv).toBeUndefined();
});

test("localStorage works in happy-dom env", () => {
  expect(typeof localStorage).toEqual("object");
  localStorage.setItem("k", "v");
  expect(localStorage.getItem("k")).toEqual("v");
  localStorage.removeItem("k");
});
