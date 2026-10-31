import {playwright} from "@vitest/browser-playwright";
import {defineConfig} from "vitest/config";
import {base, backend, browser} from "../../index.ts";

export default defineConfig(base({
  url: import.meta.url,
  test: {
    projects: [
      backend({test: {name: "node", include: ["node.test.ts"]}}),
      browser({test: {name: "browser", include: ["browser.test.ts"], browser: {provider: playwright(), instances: [{browser: "chromium"}]}}}),
    ],
  },
}));
