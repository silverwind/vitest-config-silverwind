# vitest-config-silverwind [![](https://img.shields.io/npm/v/vitest-config-silverwind.svg)](https://www.npmjs.org/package/vitest-config-silverwind) [![](https://img.shields.io/badge/licence-bsd-blue.svg)](https://raw.githubusercontent.com/silverwind/vitest-config-silverwind/master/LICENSE)

Shared Vitest configuration

```js
import {defineConfig} from "vitest/dist/config.js";
import {backend} from "vitest-config-silverwind";

export default defineConfig(backend({url: import.meta.url}));
```

© [silverwind](https://github.com/silverwind), distributed under BSD licence.
