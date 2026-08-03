# vitest-config-silverwind [![](https://img.shields.io/npm/v/vitest-config-silverwind.svg)](https://www.npmjs.org/package/vitest-config-silverwind) [![](https://packagephobia.com/badge?p=vitest-config-silverwind)](https://packagephobia.com/result?p=vitest-config-silverwind) [![](https://img.shields.io/badge/licence-bsd-blue.svg)](https://raw.githubusercontent.com/silverwind/vitest-config-silverwind/master/LICENSE)

Shared Vitest configuration

```js
import {defineConfig} from "vitest/config";
import {backend} from "vitest-config-silverwind";

export default defineConfig(backend({url: import.meta.url}));
```

The setup file registers [jest-extended](https://github.com/jest-community/jest-extended) matchers. To type them, add the `types` entry to `compilerOptions.types` instead of depending on `jest-extended` directly:

```json
{
  "compilerOptions": {
    "types": [
      "node",
      "vitest/globals",
      "vitest-config-silverwind/types"
    ]
  }
}
```

© [silverwind](https://github.com/silverwind), distributed under BSD licence.
