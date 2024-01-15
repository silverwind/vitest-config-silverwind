import {join, dirname, basename, relative, sep} from "node:path";
import {fileURLToPath} from "node:url";

const base = ({url} = {}) => ({
  include: ["**/?(*.)test.?(c|m)[jt]s?(x)"],
  testTimeout: 30000,
  pool: "forks", // https://github.com/vitest-dev/vitest/issues/2008
  cache: false, // https://github.com/vitest-dev/vitest/issues/2008
  open: false,
  allowOnly: true,
  passWithNoTests: true,
  globals: true,
  watch: false,
  disableConsoleIntercept: true,
  resolveSnapshotPath: (path, extension) => {
    if (url) { // single snapshot dir in root
      const root = dirname(fileURLToPath(new URL(url)));
      const file = `${relative(root, path).replaceAll(sep, ".")}${extension}`;
      return join(root, "snapshots", file);
    } else { // subfolder besides the file
      return join(dirname(path), "snapshots", `${basename(path)}${extension}`);
    }
  },
});

export const frontendTest = opts => ({
  environment: "jsdom",
  ...base(opts),
});

export const backendTest = opts => ({
  environment: "node",
  ...base(opts),
});
