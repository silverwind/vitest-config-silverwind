import {join, dirname, basename, relative, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {accessSync, constants} from "node:fs";
import {stringPlugin} from "vite-string-plugin";
import type {InlineConfig} from "vitest";
import type {Plugin, UserConfig, PluginOption} from "vite";

type VitestConfig = UserConfig & { test?: InlineConfig };
type CustomConfig = VitestConfig & {
  /** The value of import.meta.url from your config. */
  url: string,
};

const defaultConfig = {
  url: "",
};

function uniq<T extends any[]>(arr: T): T {
  return Array.from(new Set(arr)) as T;
}

function uniquePluginName(plugin: Plugin): string {
  const apply = typeof plugin.apply === "string" ? plugin.apply : "";
  return `${plugin.name}-${apply}-${String(plugin.enforce)}`;
}

function dedupePlugins(libPlugins: PluginOption[], userPlugins: PluginOption[]): PluginOption[] {
  const seen: Set<any> = new Set([]);
  const ret: Plugin[] = [];

  for (const plugin of [...userPlugins, ...libPlugins]) { // prefer user plugins
    const name = plugin ? uniquePluginName(plugin as Plugin) : null;

    if (seen.has(name)) {
      continue;
    } else {
      ret.push(plugin as Plugin);
      if (name) {
        seen.add(name);
      }
    }
  }

  return ret;
}

// avoid vite bug https://github.com/vitejs/vite/issues/3295
const setupFileJs = "vitest.setup.js";
const setupFileTs = "vitest.setup.ts";

function base({url, test: {setupFiles = [], ...otherTest} = {}, plugins = [], ...other}: CustomConfig): VitestConfig {
  let setupFile: string = "";
  for (const file of [setupFileJs, setupFileTs]) {
    try {
      const path = fileURLToPath(new URL(file, import.meta.url));
      accessSync(path, constants.R_OK);
      setupFile = path;
    } catch {}
  }

  return {
    test: {
      include: [
        "**/?(*.)test.?(c|m)[jt]s?(x)",
      ],
      exclude: [
        "**/{node_modules,dist,e2e,snapshots}/**",
        "**/.{air,git,github,gitea,swc,ruff_cache,venv,vscode}/**",
      ],
      setupFiles: uniq([
        setupFile,
        ...setupFiles,
      ].filter(Boolean)),
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
    ], plugins),
    ...other,
  };
}

export const frontend = ({test = {}, ...other}: CustomConfig = defaultConfig): VitestConfig => base({
  test: {
    environment: "happy-dom",
    ...test,
  },
  ...other,
});

export const backend = ({test = {}, ...other}: CustomConfig = defaultConfig): VitestConfig => base({
  test: {
    environment: "node",
    ...test,
  },
  ...other,
});
