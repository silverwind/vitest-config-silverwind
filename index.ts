import {join, dirname, basename, relative, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {stringPlugin} from "vite-string-plugin";
import type {UserConfig} from "vitest";

const uniq = arr => Array.from(new Set(arr));
const uniquePluginName = ({name, apply, enforce} = {}) => `${name}-${apply}-${enforce}`;

function dedupePlugins(plugins) {
  const seen = new Set([]);
  const ret = [];

  for (const plugin of plugins.reverse()) {
    const name = plugin ? uniquePluginName(plugin) : null;

    if (seen.has(name)) {
      continue;
    } else {
      ret.push(plugin);
      if (name) {
        seen.add(name);
      }
    }
  }

  return ret;
}

const base = ({url, test: {setupFiles = [], ...otherTest}, plugins = [], ...other} = {}) => ({
  test: {
    include: [
      "**/?(*.)test.?(c|m)[jt]s?(x)",
    ],
    exclude: [
      "**/{node_modules,dist,e2e,snapshots}/**",
      "**/.{air,git,github,gitea,swc,ruff_cache,venv,vscode}/**",
    ],
    setupFiles: uniq([
      fileURLToPath(new URL("vitest.setup.ts", import.meta.url)),
      ...setupFiles,
    ]),
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
    ...otherTest,
  },
  plugins: dedupePlugins([
    stringPlugin(),
    ...plugins,
  ]),
  ...other,
});

export const frontend = ({test = {}, ...other} = {}): UserConfig => base({
  test: {
    environment: "happy-dom",
    ...test,
  },
  ...other,
});

export const backend = ({test = {}, ...other} = {}): UserConfig => base({
  test: {
    environment: "node",
    ...test,
  },
  ...other,
});
