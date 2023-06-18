export const config = {
  test: {
    include: ["**/test.js", "**/*.test.js"],
    testTimeout: 20000,
    environment: "node",
    threads: false, // https://github.com/vitest-dev/vitest/issues/2008
    cache: false, // https://github.com/vitest-dev/vitest/issues/2008
    open: false,
    allowOnly: true,
    passWithNoTests: true,
    globals: true,
    watch: false,
    outputDiffLines: Infinity,
  }
};
