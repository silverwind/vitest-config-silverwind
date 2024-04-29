import {defineConfig} from "vite";
import {fileURLToPath} from "node:url";
import dtsPlugin from "vite-plugin-dts";
import {builtinModules} from "node:module";
import {stringPlugin} from "vite-string-plugin";

export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL("dist", import.meta.url)),
    minify: false,
    sourcemap: false,
    target: "modules",
    emptyOutDir: true,
    chunkSizeWarningLimit: Infinity,
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    lib: {
      entry: [
        fileURLToPath(new URL("index.ts", import.meta.url)),
        fileURLToPath(new URL("vitest.setup.ts", import.meta.url)),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "jest-extended",
        "vite-string-plugin",
        "vitest",
        ...builtinModules.map(module => `node:${module}`),
      ],
    }
  },
  plugins: [
    dtsPlugin({
      include: [
        "index.ts",
        "vitest.setup.ts",
      ],
    }),
    stringPlugin(),
  ],
});
