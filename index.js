const test = {
  include: ["**/test.js", "**/*.test.js"],
  testTimeout: 30000,
  threads: false, // https://github.com/vitest-dev/vitest/issues/2008
  cache: false, // https://github.com/vitest-dev/vitest/issues/2008
  open: false,
  allowOnly: true,
  passWithNoTests: true,
  globals: true,
  watch: false,
};

export const frontendTest = {
  environment: "jsdom",
  ...test,
};

export const backendTest = {
  environment: "node",
  ...test,
};
