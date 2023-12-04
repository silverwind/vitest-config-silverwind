import {join, dirname, basename} from "node:path";

const test = {
  include: ["**/?(*.)test.?(c|m)[jt]s?(x)"],
  testTimeout: 30000,
  pool: "forks", // https://github.com/vitest-dev/vitest/issues/2008
  cache: false, // https://github.com/vitest-dev/vitest/issues/2008
  open: false,
  allowOnly: true,
  passWithNoTests: true,
  globals: true,
  watch: false,
  resolveSnapshotPath: (path, extension) => {
    return join(dirname(path), "snapshots", `${basename(path)}${extension}`);
  },
};

export const frontendTest = {
  environment: "jsdom",
  ...test,
};

export const backendTest = {
  environment: "node",
  ...test,
};
