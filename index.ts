import {join, dirname, basename, relative, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {accessSync, constants} from "node:fs";
import {availableParallelism} from "node:os";
import {stringPlugin} from "vite-string-plugin";
import type {InlineConfig} from "vitest/node";
import type {Plugin, UserConfig, PluginOption} from "vite";

type VitestConfig = UserConfig & {test?: InlineConfig};
type CustomConfig = VitestConfig & {
  /** The value of import.meta.url from your config. */
  url: string,
};

const defaultConfig = {
  url: "",
};

function uniq<T extends Array<any>>(arr: T): T {
  return Array.from(new Set(arr)) as T;
}

function uniquePluginName(plugin: Plugin): string {
  const apply = typeof plugin.apply === "string" ? plugin.apply : "";
  return `${plugin.name}-${apply}-${String(plugin.enforce)}`;
}

function dedupePlugins(libPlugins: Array<PluginOption>, userPlugins: Array<PluginOption>): Array<PluginOption> {
  const seen = new Set<any>();
  const ret: Array<Plugin> = [];

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

/** Directories to exclude from both test discovery and coverage */
const dirExclude = [
  "**/{node_modules,dist,build,e2e,snapshots,fixtures,persistent}/**",
  "**/.{air,git,github,gitea,make,playwright-mcp,swc,ruff_cache,venv,vscode}/**",
];

/** Files to exclude from coverage, always applied even when user adds custom excludes */
const coverageExclude = [
  "**/*.config.*",
  "**/*.test.*",
  "**/*.stories.*",
  "**/*.d.ts",
  "**/bench.*",
  "**/package.json",
  ...dirExclude,
];

function base({url, test: {setupFiles = [], coverage: userCoverage, ...otherTest} = {}, plugins = [], ...other}: CustomConfig): VitestConfig {
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
      exclude: dirExclude,
      setupFiles: uniq([
        setupFile,
        ...setupFiles,
      ].filter(Boolean)),
      testTimeout: 30000,
      maxConcurrency: availableParallelism(),
      isolate: false, // perf improvement when tests are pure
      pool: "forks", // https://github.com/vitest-dev/vitest/issues/2008
      cache: false, // https://github.com/vitest-dev/vitest/issues/2008
      open: false,
      allowOnly: true,
      passWithNoTests: true,
      globals: true,
      watch: false,
      sequence: {concurrent: true},
      coverage: {
        provider: "v8",
        reporter: ["text"],
        include: ["**/*.{js,ts,jsx,tsx}"],
        ...userCoverage,
        exclude: uniq([
          ...coverageExclude,
          ...(userCoverage?.exclude ?? []),
        ]),
      },
      snapshotFormat: {maxOutputLength: 50 * 1024 * 1024},
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

// Node 25+ enables Web Storage by default, which shadows happy-dom's Storage in
// vitest's env setup so `localStorage` reads as `undefined` in tests.
// https://github.com/vitest-dev/vitest/issues/8757
// https://github.com/capricorn86/happy-dom/issues/1950
const nodeMajor = Number(process.versions.node.split(".")[0]);
const happyDomExecArgv = nodeMajor >= 25 ? ["--no-experimental-webstorage"] : [];

export const frontend = ({test = {}, ...other}: CustomConfig = defaultConfig): VitestConfig => base({
  test: {
    environment: "happy-dom",
    execArgv: happyDomExecArgv,
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
