import {defineConfig} from "vitest/config";
import {base, backend, frontend} from "../../index.ts";

export default defineConfig(base({
  url: import.meta.url,
  test: {
    projects: [
      backend({test: {name: "node", include: ["node.test.ts"]}}),
      frontend({test: {name: "dom", include: ["dom.test.ts"]}}),
    ],
  },
}));
