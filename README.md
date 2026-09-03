# vitest-config-silverwind [![](https://img.shields.io/npm/v/vitest-config-silverwind.svg)](https://www.npmjs.org/package/vitest-config-silverwind) [![](https://packagephobia.com/badge?p=vitest-config-silverwind)](https://packagephobia.com/result?p=vitest-config-silverwind) [![](https://img.shields.io/badge/licence-bsd-blue.svg)](https://raw.githubusercontent.com/silverwind/vitest-config-silverwind/master/LICENSE)

Shared Vitest configuration

```js
import {defineConfig} from "vitest/config";
import {backend} from "vitest-config-silverwind";

export default defineConfig(backend({url: import.meta.url}));
```

`frontend` runs tests in happy-dom, `backend` in node. `browser` runs them in real browsers, where `provider` and `instances` are yours to pick:

```js
import {defineConfig} from "vitest/config";
import {playwright} from "@vitest/browser-playwright";
import {browser} from "vitest-config-silverwind";

export default defineConfig(browser({
  url: import.meta.url,
  test: {
    browser: {
      provider: playwright(),
      instances: [{browser: "chromium"}, {browser: "firefox"}, {browser: "webkit"}],
    },
  },
}));
```

For `projects`, `base` is the root without an environment, and inside `projects` the functions contribute only their environment on top of what the root shares:

```js
import {defineConfig} from "vitest/config";
import {playwright} from "@vitest/browser-playwright";
import {base, backend, browser} from "vitest-config-silverwind";

export default defineConfig(base({
  url: import.meta.url,
  test: {
    projects: [
      browser({test: {name: "browser", include: ["**/*.test.tsx"], browser: {provider: playwright(), instances: [{browser: "chromium"}]}}}),
      backend({test: {name: "node", include: ["**/*.test.ts"]}}),
    ],
  },
}));
```

[jest-extended](https://github.com/jest-community/jest-extended) matchers are registered and typed automatically, no `jest-extended` dependency needed.

© [silverwind](https://github.com/silverwind), distributed under BSD licence.
