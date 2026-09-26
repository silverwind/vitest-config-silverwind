import {matchesGlob, resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {base, frontend, backend, browser} from "./index.ts";

test("config", () => {
  expect(frontend().test!.environment).toBeTruthy();
  expect(backend().test!.environment).toBeTruthy();
  expect(backend().test!.setupFiles!.length).toEqual(1);
  expect(backend().plugins!.length).toEqual(1);
  expect(backend({test: {setupFiles: ["foo"]}}).test!.setupFiles!.length).toEqual(2);
  expect(backend({test: {setupFiles: "foo"}}).test!.setupFiles!.length).toEqual(2);
  expect(backend({plugins: [{name: "foo"}]}).plugins!.length).toEqual(2);
  expect(backend({plugins: [{name: "1"}, {name: "1"}]}).plugins!.length).toEqual(2);
  expect(backend({plugins: [{name: "1"}, {name: "2"}]}).plugins!.length).toEqual(3);
  expect(backend({plugins: [[{name: "1"}], Promise.resolve({name: "2"})]}).plugins!.length).toEqual(3);
});

test("excludes agent tool directories", () => {
  const exclude = backend().test!.exclude!;
  expect([".claude/worktrees/agent-1/index.test.ts", "sub/.codex/skills/foo.test.ts", "src/foo.test.ts"]
    .map(file => exclude.some(pattern => matchesGlob(file, pattern)))).toEqual([true, true, false]);
});

test("browser", () => {
  const defaults = browser().test!;
  expect(defaults.browser).toEqual({enabled: true, headless: true, screenshotFailures: false});
  expect(defaults.environment).toBeUndefined();
  expect(browser({test: {browser: {headless: false, instances: [{browser: "chromium"}]}}}).test!.browser).toEqual({
    enabled: true, headless: false, screenshotFailures: false, instances: [{browser: "chromium"}],
  });
  expect(browser({test: {maxWorkers: 1}}).test!.maxWorkers).toEqual(1);
});

test.each([
  ["defaults", undefined, ["**/*.{js,ts,jsx,tsx}"], []],
  ["merge preserves defaults", {include: ["src/**/*.ts"], exclude: ["src/generated.ts"]}, ["src/**/*.ts"], ["src/generated.ts"]],
])("coverage %s", (_name, coverage, include, exclude) => {
  expect(backend({test: {coverage}}).test!.coverage).toMatchObject({
    provider: "v8", reporter: ["text"], include, exclude: expect.arrayContaining(["**/*.test.*", "**/*.d.ts", ...exclude]),
  });
});

test("reporters disable job summary in CI", () => {
  try {
    vi.stubEnv("GITHUB_ACTIONS", "true");
    expect(backend().test!.reporters).toEqual(["default", ["github-actions", {jobSummary: {enabled: false}}]]);
    vi.stubEnv("GITHUB_ACTIONS", undefined);
    expect(backend().test!.reporters).toEqual(["default"]);
  } finally {
    vi.unstubAllEnvs();
  }
});

test("jest-extended", () => {
  expect([]).toBeArray();
  expect({}).toBeObject();
});

test("projects omit the root include", () => {
  expect(backend().test!.include).toBeArray();
  expect(backend({test: {projects: [{test: {name: "a"}}]}}).test!.include).toBeUndefined();
});

test("projects built here contribute only their input", () => {
  const config = base({test: {projects: [
    backend({test: {name: "a", include: ["a/**"]}}),
    browser({test: {name: "b"}}),
    {test: {name: "c"}},
    "packages/*",
  ]}});
  expect(config.test!.environment).toBeUndefined();
  expect(config.test!.projects).toEqual([
    {test: {environment: "node", name: "a", include: ["a/**"]}},
    {test: {browser: {enabled: true, headless: true, screenshotFailures: false}, name: "b"}},
    {test: {name: "c"}},
    "packages/*",
  ]);
});

test("a multi-project run emits no warnings", () => {
  const env = {...Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(VITEST|NODE_OPTIONS|NODE_NO_WARNINGS|FORCE_COLOR)/.test(key))), NO_COLOR: "1"};
  const {status, stdout, stderr} = spawnSync(process.execPath, [
    resolve("node_modules/vitest/vitest.mjs"), "run", "--root", resolve("fixtures/projects"),
  ], {encoding: "utf8", env});
  const output = `${stdout}${stderr}`;
  expect(output).toMatch(/Test Files\s+2 passed/);
  expect(output).not.toMatch(/warn/i);
  expect(status).toEqual(0);
});

test("localStorage works in happy-dom env", () => {
  expect(typeof localStorage).toEqual("object");
  localStorage.setItem("k", "v");
  expect(localStorage.getItem("k")).toEqual("v");
  localStorage.removeItem("k");
});
