import {join, dirname, basename, relative, sep} from "node:path";
import {fileURLToPath} from "node:url";

const base = ({url, setupFiles = [], ...opts} = {}) => ({
  include: [
    "**/?(*.)test.?(c|m)[jt]s?(x)",
  ],
  exclude: [
    "**/{node_modules,dist,e2e,snapshots}/**",
    "**/.{air,git,github,gitea,swc,ruff_cache,venv,vscode}/**",
  ],
  setupFiles: [
    fileURLToPath(new URL("vitest.setup.js", import.meta.url)),
    ...setupFiles,
  ],
  testTimeout: 30000,
  pool: "forks", // https://github.com/vitest-dev/vitest/issues/2008
  cache: false, // https://github.com/vitest-dev/vitest/issues/2008
  open: false,
  allowOnly: true,
  passWithNoTests: true,
  globals: true,
  watch: false,
  resolveSnapshotPath: (path, extension) => {
    if (url) { // single snapshot dir in root
      const root = dirname(fileURLToPath(new URL(url)));
      const file = `${relative(root, path).replaceAll(sep, ".")}${extension}`;
      return join(root, "snapshots", file);
    } else { // subfolder besides the file
      return join(dirname(path), "snapshots", `${basename(path)}${extension}`);
    }
  },
  ...opts,
});

export const frontendTest = opts => ({
  environment: "happy-dom",
  ...base(opts),
});

export const backendTest = opts => ({
  environment: "node",
  ...base(opts),
});
