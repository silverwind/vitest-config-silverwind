import {nodeLib} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";
import {fileURLToPath} from "node:url";

export default defineConfig(nodeLib({
  url: import.meta.url,
  entry: [
    fileURLToPath(new URL("index.ts", import.meta.url)),
    fileURLToPath(new URL("vitest.setup.ts", import.meta.url)),
  ],
  external: [
    "vitest",
  ]
}));
